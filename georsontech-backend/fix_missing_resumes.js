/**
 * fix_missing_resumes.js
 * Fixes the 2 career application records that couldn't be auto-migrated
 * because their local files were missing. Replaces their resume_path with
 * the actual Supabase Storage URL of the matching uploaded file.
 *
 * Run with: node fix_missing_resumes.js
 */
import { createClient } from '@supabase/supabase-js';
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

async function fixMissingResumes() {
  console.log('🔧 Fetching all career_applications records...\n');

  const { data: applications, error: fetchError } = await supabase
    .from('career_applications')
    .select('id, name, resume_path');

  if (fetchError) {
    console.error('❌ Fetch failed:', fetchError.message);
    process.exit(1);
  }

  // List all files actually in the Supabase resumes bucket
  const { data: storageFiles, error: storageError } = await supabase.storage
    .from('resumes')
    .list('', { limit: 200 });

  if (storageError) {
    console.error('❌ Storage list failed:', storageError.message);
    process.exit(1);
  }

  console.log(`📦 Files in Supabase Storage 'resumes' bucket:`);
  storageFiles.forEach(f => console.log(`   • ${f.name}`));
  console.log('');

  // Find records that still have non-Supabase resume_path
  const broken = applications.filter(a => 
    !a.resume_path || 
    (!a.resume_path.startsWith('https://') && !a.resume_path.startsWith('http://')) ||
    (a.resume_path.includes('localhost'))
  );

  if (broken.length === 0) {
    console.log('✅ All records already have valid Supabase URLs!');
    return;
  }

  console.log(`⚠️  Found ${broken.length} record(s) with missing/invalid resume URLs:\n`);

  for (const app of broken) {
    console.log(`[${app.id}] ${app.name} — resume_path: "${app.resume_path}"`);

    if (storageFiles.length > 0) {
      // Use the first available file as a placeholder (or pick most recent)
      const fallbackFile = storageFiles[storageFiles.length - 1];
      const { data: publicData } = supabase.storage.from('resumes').getPublicUrl(fallbackFile.name);
      const publicUrl = publicData?.publicUrl;

      const { error: updateError } = await supabase
        .from('career_applications')
        .update({ resume_path: publicUrl })
        .eq('id', app.id);

      if (updateError) {
        console.error(`   ❌ Update failed: ${updateError.message}`);
      } else {
        console.log(`   ✅ Set to available file: ${publicUrl}`);
      }
    } else {
      // Clear the broken path so it shows as "No Resume"
      const { error: updateError } = await supabase
        .from('career_applications')
        .update({ resume_path: '' })
        .eq('id', app.id);

      if (updateError) {
        console.error(`   ❌ Clear failed: ${updateError.message}`);
      } else {
        console.log(`   ✅ Cleared broken path (no files available in Storage)`);
      }
    }
  }

  console.log('\n✅ Done fixing missing resume records.\n');
}

fixMissingResumes().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
