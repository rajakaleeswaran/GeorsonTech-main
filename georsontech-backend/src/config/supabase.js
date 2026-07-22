import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Use service key on backend for full storage access (bypasses RLS)
export const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Upload a file buffer/stream to Supabase Storage
 * @param {string} bucket - bucket name e.g. 'resumes'
 * @param {string} fileName - target file name in bucket
 * @param {Buffer} fileBuffer - file buffer
 * @param {string} mimeType - file MIME type
 * @returns {string|null} public URL or null on failure
 */
export async function uploadToSupabase(bucket, fileName, fileBuffer, mimeType) {
  if (!supabase) {
    console.warn('[Supabase] Client not initialised – SUPABASE_URL or SUPABASE_SERVICE_KEY missing');
    return null;
  }
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: mimeType || 'application/octet-stream',
        upsert: true,
        cacheControl: '3600'
      });

    if (error) {
      console.warn('[Supabase] Storage upload error:', error.message);
      return null;
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicData?.publicUrl || null;
  } catch (e) {
    console.warn('[Supabase] Storage upload exception:', e.message);
    return null;
  }
}
