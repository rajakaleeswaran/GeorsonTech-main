import { createClient } from '@supabase/supabase-js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://gfyvfjgwnercvunvqzpk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Use service key on backend for full storage access (bypasses RLS)
export const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Clean original filename to prevent storage issues
 */
function cleanFileName(originalName) {
  const ext = path.extname(originalName || '').toLowerCase();
  const nameWithoutExt = path.basename(originalName || 'file', ext);
  const sanitized = nameWithoutExt.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${Date.now()}_${sanitized}${ext}`;
}

/**
 * Generic file uploader to Supabase Storage bucket using buffer (memory storage)
 */
export async function uploadFileToBucket(bucket, file, allowedTypes, allowedExtsLabel) {
  if (!file) return null;

  // If already a public HTTP/HTTPS URL, return as-is
  if (typeof file === 'string' && (file.startsWith('http://') || file.startsWith('https://'))) {
    return file;
  }

  if (!supabase) {
    console.error('[Supabase Storage] Supabase client is not initialized. Check SUPABASE_URL and SUPABASE_SERVICE_KEY.');
    throw new Error('Supabase Storage is not configured on server.');
  }

  const originalName = file.originalname || 'file';
  const ext = path.extname(originalName).toLowerCase().replace('.', '');
  const mimeType = file.mimetype || '';

  const isValidType = allowedTypes.some(t => mimeType.includes(t) || ext === t);
  if (!isValidType) {
    const err = `Invalid file format for ${originalName}. Allowed formats: ${allowedExtsLabel}`;
    console.error(`[Supabase Upload Validation Failure] ${err}`);
    throw new Error(err);
  }

  const fileBuffer = file.buffer;
  if (!fileBuffer) {
    throw new Error(`File buffer is missing for ${originalName}`);
  }

  const fileName = cleanFileName(originalName);

  console.log(`[Supabase Storage] Uploading ${fileName} to bucket '${bucket}' (${file.size || fileBuffer.length} bytes)...`);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, fileBuffer, {
      contentType: mimeType || 'application/octet-stream',
      upsert: true,
      cacheControl: '3600'
    });

  if (error) {
    console.error(`[Supabase Upload Failed] Bucket: ${bucket}, Error: ${error.message}`);
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  const publicUrl = publicData?.publicUrl;

  if (!publicUrl) {
    throw new Error(`Failed to generate public URL for uploaded file ${fileName}`);
  }

  console.log(`[Supabase Upload Success] Bucket: '${bucket}' -> Public URL: ${publicUrl}`);
  return publicUrl;
}

/**
 * Upload Image to Supabase 'uploads' bucket
 * Allowed extensions: jpg, jpeg, png, webp
 */
export async function uploadImageToSupabase(file) {
  return uploadFileToBucket('uploads', file, ['jpg', 'jpeg', 'png', 'webp', 'image'], 'JPG, JPEG, PNG, WEBP');
}

/**
 * Upload Brochure to Supabase 'brochures' bucket
 * Allowed extensions: pdf
 */
export async function uploadBrochureToSupabase(file) {
  return uploadFileToBucket('brochures', file, ['pdf', 'application/pdf'], 'PDF');
}

/**
 * Upload Resume to Supabase 'resumes' bucket
 * Allowed extensions: pdf
 */
export async function uploadResumeToSupabase(file) {
  return uploadFileToBucket('resumes', file, ['pdf', 'application/pdf', 'doc', 'docx', 'word'], 'PDF');
}

/**
 * Legacy support wrapper
 */
export async function uploadToSupabase(bucket, fileName, fileBuffer, mimeType) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: mimeType || 'application/octet-stream',
        upsert: true,
        cacheControl: '3600'
      });
    if (error) return null;
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicData?.publicUrl || null;
  } catch (_) {
    return null;
  }
}

