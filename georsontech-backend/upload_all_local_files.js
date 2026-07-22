/**
 * upload_all_local_files.js
 * Uploads ALL local resume files to Supabase Storage (regardless of DB records).
 * Then runs a second pass to update any DB records that still point to local paths.
 *
 * Run with: node upload_all_local_files.js
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

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf') return 'application/pdf';
  if (ext === '.doc') return 'application/msword';
  if (ext === '.docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  return 'application/octet-stream';
}

async function uploadAllFiles() {
  const localFiles = fs.readdirSync(RESUMES_DIR);
  console.log(`📁 Uploading ${localFiles.length} local file(s) to Supabase Storage...\n`);

  // Map: decoded filename → supabase public URL
  const uploadedMap = {};

  for (const fileName of localFiles) {
    const localPath = path.join(RESUMES_DIR, fileName);
    const fileBuffer = fs.readFileSync(localPath);
    const mimeType = getMimeType(fileName);

    process.stdout.write(`⬆️  Uploading "${fileName}" ... `);

    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(fileName, fileBuffer, { contentType: mimeType, upsert: true, cacheControl: '3600' });

    if (error) {
      console.log(`❌ FAILED: ${error.message}`);
      continue;
    }

    const { data: publicData } = supabase.storage.from('resumes').getPublicUrl(fileName);
    const publicUrl = publicData?.publicUrl;
    console.log(`✅`);

    // Store both original and decoded key
    uploadedMap[fileName] = publicUrl;
    try {
      uploadedMap[decodeURIComponent(fileName)] = publicUrl;
    } catch (_) {}
  }

  console.log(`\n✅ Uploaded ${Object.keys(uploadedMap).length} file(s)\n`);
  return uploadedMap;
}

async function updateDbRecords(uploadedMap) {
  const { data: applications, error } = await supabase
    .from('career_applications')
    .select('id, name, resume_path');

  if (error) {
    console.error('❌ Could not fetch career_applications:', error.message);
    return;
  }

  console.log(`\n📋 Checking ${applications.length} DB record(s) for updates...\n`);

  for (const app of applications) {
    const { id, name, resume_path } = app;

    // Already a valid Supabase URL
    if (resume_path?.includes('supabase.co')) {
      console.log(`✅ [${id}] ${name} — already OK`);
      continue;
    }

    const storedFilename = resume_path?.split('/').pop() || '';
    let decodedFilename;
    try { decodedFilename = decodeURIComponent(storedFilename); } catch { decodedFilename = storedFilename; }

    const matchedUrl = uploadedMap[storedFilename] || uploadedMap[decodedFilename];

    if (!matchedUrl) {
      console.log(`⚠️  [${id}] ${name} — file "${storedFilename}" not found in uploaded set`);
      continue;
    }

    const { error: updateError } = await supabase
      .from('career_applications')
      .update({ resume_path: matchedUrl })
      .eq('id', id);

    if (updateError) {
      console.error(`❌ [${id}] ${name} — update failed: ${updateError.message}`);
    } else {
      console.log(`✅ [${id}] ${name} — updated to Supabase URL`);
    }
  }
}

async function run() {
  const uploadedMap = await uploadAllFiles();
  await updateDbRecords(uploadedMap);
  console.log('\n🎉 All done!\n');
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
