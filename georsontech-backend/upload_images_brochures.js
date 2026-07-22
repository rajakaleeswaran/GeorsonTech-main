/**
 * upload_images_brochures.js
 * Uploads all local images and brochures to Supabase Storage,
 * then updates all DB records that still have local paths.
 *
 * Usage: node upload_images_brochures.js
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = {
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf', '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  return map[ext] || 'application/octet-stream';
}

/**
 * Ensure a Supabase Storage bucket exists (public)
 */
async function ensureBucket(bucketName) {
  const { data: existing } = await supabase.storage.listBuckets();
  const found = existing?.find(b => b.id === bucketName);
  if (found) {
    console.log(`  ✅ Bucket "${bucketName}" already exists`);
    return;
  }
  const { error } = await supabase.storage.createBucket(bucketName, { public: true });
  if (error) {
    console.error(`  ❌ Could not create bucket "${bucketName}": ${error.message}`);
  } else {
    console.log(`  ✅ Created public bucket "${bucketName}"`);
  }
}

/**
 * Upload all files from a local directory to a Supabase bucket
 * Returns a map of { decodedFilename → publicUrl }
 */
async function uploadDirectory(localDir, bucket) {
  const urlMap = {};
  if (!fs.existsSync(localDir)) {
    console.log(`  ⚠️  Directory not found: ${localDir}`);
    return urlMap;
  }

  const files = fs.readdirSync(localDir);
  console.log(`\n  📁 Uploading ${files.length} file(s) from ${path.basename(localDir)}/ → bucket "${bucket}"`);

  for (const fileName of files) {
    const localPath = path.join(localDir, fileName);
    const fileBuffer = fs.readFileSync(localPath);
    const mimeType = getMimeType(fileName);

    process.stdout.write(`     ⬆️  "${fileName}" ... `);

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, { contentType: mimeType, upsert: true, cacheControl: '3600' });

    if (error) {
      console.log(`❌ ${error.message}`);
      continue;
    }

    const { data: pd } = supabase.storage.from(bucket).getPublicUrl(fileName);
    const publicUrl = pd?.publicUrl;
    console.log(`✅`);

    urlMap[fileName] = publicUrl;
    try { urlMap[decodeURIComponent(fileName)] = publicUrl; } catch (_) {}
  }

  return urlMap;
}

/**
 * Update a Supabase table's path column: replace local paths with Supabase URLs
 */
async function updateTablePaths(table, pathColumn, urlMap, bucket) {
  const { data: rows, error } = await supabase.from(table).select(`id, ${pathColumn}`);
  if (error) {
    console.log(`  ⚠️  Could not fetch ${table}: ${error.message}`);
    return;
  }

  let updated = 0, skipped = 0;
  for (const row of rows) {
    const rawPath = row[pathColumn];
    if (!rawPath) { skipped++; continue; }
    if (rawPath.includes('supabase.co')) { skipped++; continue; }

    const fileName = rawPath.split('/').pop();
    let decodedFileName;
    try { decodedFileName = decodeURIComponent(fileName); } catch { decodedFileName = fileName; }

    const newUrl = urlMap[fileName] || urlMap[decodedFileName];
    if (!newUrl) {
      // Try to construct the URL directly if filename matches bucket files
      const directUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
      console.log(`  ⚠️  [${table}/${row.id}] file "${fileName}" not in upload set, skipping`);
      skipped++;
      continue;
    }

    const { error: updateErr } = await supabase
      .from(table)
      .update({ [pathColumn]: newUrl })
      .eq('id', row.id);

    if (updateErr) {
      console.log(`  ❌ [${table}/${row.id}] update failed: ${updateErr.message}`);
    } else {
      console.log(`  ✅ [${table}/${row.id}] → ${newUrl}`);
      updated++;
    }
  }

  console.log(`  📊 ${table}.${pathColumn}: ${updated} updated, ${skipped} skipped\n`);
}

async function run() {
  const UPLOADS_DIR = path.join(__dirname, 'uploads');

  console.log('\n🚀 GeorsonTech — Supabase Storage Migration (Images + Brochures)\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Step 1: Ensure buckets exist
  console.log('📦 Ensuring Supabase Storage buckets exist...');
  await ensureBucket('uploads');
  await ensureBucket('brochures');
  await ensureBucket('resumes');

  // Step 2: Upload images → 'uploads' bucket
  const imageMap = await uploadDirectory(path.join(UPLOADS_DIR, 'images'), 'uploads');

  // Step 3: Upload brochures → 'brochures' bucket
  const brochureMap = await uploadDirectory(path.join(UPLOADS_DIR, 'brochures'), 'brochures');

  // Step 4: Update DB tables
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Updating database records...\n');

  // clients table: logo_path
  await updateTablePaths('clients', 'logo_path', imageMap, 'uploads');

  // industries table (if it exists): image_path or similar
  await updateTablePaths('industries', 'image_path', imageMap, 'uploads');

  // products table: image column
  await updateTablePaths('products', 'image', imageMap, 'uploads');
  await updateTablePaths('products', 'brochure_path', brochureMap, 'brochures');

  // blogs table: featured_image or image
  await updateTablePaths('blogs', 'featured_image', imageMap, 'uploads');

  // solutions / solution_categories
  await updateTablePaths('solutions', 'image', imageMap, 'uploads');
  await updateTablePaths('solution_categories', 'image', imageMap, 'uploads');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Migration complete! All local files are now in Supabase Storage.\n');
}

run().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
