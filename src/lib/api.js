import { supabase, supabaseUrl } from './supabase';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:5000';

/**
 * Resolves full asset URL for uploaded files, resumes, or remote image URLs.
 * When Supabase is active, converts any local/relative path to a Supabase Storage public URL.
 * @param {string} path
 * @param {string} [type] Optional asset type: 'resume' | 'image' | 'brochure'
 * @returns {string}
 */
export function getAssetUrl(path, type = 'general') {
  if (!path) return '';

  let cleanPath = path.replace(/\\/g, '/');

  // Already a valid absolute non-localhost URL → return as-is
  if (
    (cleanPath.startsWith('https://') || cleanPath.startsWith('data:')) &&
    !cleanPath.includes('localhost') &&
    !cleanPath.includes('127.0.0.1')
  ) {
    return cleanPath;
  }

  // Check if Supabase is configured
  const activeSupaUrl = import.meta.env.VITE_SUPABASE_URL || supabaseUrl;
  const isSupabaseActive = Boolean(activeSupaUrl && !activeSupaUrl.includes('placeholder.supabase.co'));

  if (isSupabaseActive) {
    // Determine bucket — check brochure BEFORE pdf extension (brochures are also PDFs)
    let bucket = 'uploads';
    if (type === 'brochure' || cleanPath.includes('/brochures/')) {
      bucket = 'brochures';
    } else if (
      type === 'resume' ||
      cleanPath.includes('/resumes/') ||
      cleanPath.endsWith('.doc') ||
      cleanPath.endsWith('.docx')
    ) {
      bucket = 'resumes';
    }

    // Extract just the filename (files are uploaded flat to bucket root)
    const rawFileName = cleanPath.split('/').pop();
    let fileName = rawFileName;
    try { fileName = decodeURIComponent(rawFileName); } catch (_) {}

    if (fileName) {
      try {
        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);
        if (publicData?.publicUrl) return publicData.publicUrl;
      } catch (_) {
        // Fallback below
      }
    }
  }

  // Final fallback: return local Express URL
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) return cleanPath;
  if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);

  if (!cleanPath.startsWith('uploads/')) {
    if (type === 'resume' || cleanPath.endsWith('.pdf') || cleanPath.endsWith('.doc') || cleanPath.endsWith('.docx')) {
      cleanPath = `uploads/resumes/${cleanPath}`;
    } else if (type === 'brochure') {
      cleanPath = `uploads/brochures/${cleanPath}`;
    } else {
      cleanPath = `uploads/images/${cleanPath}`;
    }
  }

  return `${UPLOADS_BASE_URL}/${cleanPath}`;
}

