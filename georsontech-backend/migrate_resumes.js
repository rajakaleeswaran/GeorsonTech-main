/**
 * migrate_resumes.js
 * One-time migration script: uploads all local resume files to Supabase Storage
 * and updates the career_applications table records with the new Supabase public URLs.
 *
 * Run with: node migrate_resumes.js
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
const RESUMES_DIR = path.join(__dirname, 'uploads', 'resumes');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function migrateResumes() {
  console.log('🚀 Starting resume migration to Supabase Storage...\n');

  // 1. Fetch all career_applications from Supabase
  const { data: applications, error: fetchError } = await supabase
    .from('career_applications')
    .select('id, name, resume_path');

  if (fetchError) {
    console.error('❌ Failed to fetch career_applications:', fetchError.message);
    process.exit(1);
  }

  console.log(`📋 Found ${applications.length} application(s) in DB\n`);

  // 2. Get list of local resume files
  const localFiles = fs.readdirSync(RESUMES_DIR);
  console.log(`📁 Found ${localFiles.length} local file(s) in uploads/resumes/\n`);

  let migratedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const app of applications) {
    const { id, name, resume_path } = app;

    // Skip if resume_path is already a Supabase URL
    if (resume_path && (resume_path.startsWith('https://') || resume_path.startsWith('http://'))) {
      if (resume_path.includes('supabase.co')) {
        console.log(`⏭️  [${id}] ${name} — already Supabase URL, skipping`);
        skippedCount++;
        continue;
      }
    }

    // Determine local filename from the stored path
    const storedFilename = resume_path ? resume_path.split('/').pop() : null;
    if (!storedFilename) {
      console.log(`⚠️  [${id}] ${name} — no resume_path, skipping`);
      skippedCount++;
      continue;
    }

    // Decode in case URL-encoded
    let decodedFilename;
    try { decodedFilename = decodeURIComponent(storedFilename); } catch { decodedFilename = storedFilename; }

    // Find matching local file (exact or decoded match)
    const matchedFile = localFiles.find(f => f === storedFilename || f === decodedFilename);
    if (!matchedFile) {
      console.log(`❌ [${id}] ${name} — local file not found for path: ${resume_path}`);
      errorCount++;
      continue;
    }

    const localFilePath = path.join(RESUMES_DIR, matchedFile);
    const fileBuffer = fs.readFileSync(localFilePath);
    const uploadFileName = matchedFile; // keep original filename

    console.log(`⬆️  [${id}] ${name} — uploading "${matchedFile}" ...`);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(uploadFileName, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error(`   ❌ Upload failed: ${uploadError.message}`);
      errorCount++;
      continue;
    }

    // Get public URL
    const { data: publicData } = supabase.storage.from('resumes').getPublicUrl(uploadFileName);
    const publicUrl = publicData?.publicUrl;

    if (!publicUrl) {
      console.error(`   ❌ Could not get public URL`);
      errorCount++;
      continue;
    }

    // Update the DB record
    const { error: updateError } = await supabase
      .from('career_applications')
      .update({ resume_path: publicUrl })
      .eq('id', id);

    if (updateError) {
      console.error(`   ❌ DB update failed: ${updateError.message}`);
      errorCount++;
      continue;
    }

    console.log(`   ✅ Updated: ${publicUrl}`);
    migratedCount++;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Migrated: ${migratedCount}`);
  console.log(`⏭️  Skipped:  ${skippedCount}`);
  console.log(`❌ Errors:   ${errorCount}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (migratedCount > 0) {
    console.log('🎉 Migration complete! Resume files are now in Supabase Storage.');
  }
}

migrateResumes().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
