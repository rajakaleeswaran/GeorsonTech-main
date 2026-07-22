import { supabase, supabaseUrl } from './supabase';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:5000';

/**
 * Resolves full asset URL for uploaded files, resumes, or remote image URLs.
 * Dynamically converts localhost URLs or relative paths to Supabase Storage public URLs when Supabase is active.
 * @param {string} path 
 * @param {string} [type] Optional asset type: 'resume' | 'image' | 'brochure'
 * @returns {string}
 */
export function getAssetUrl(path, type = 'general') {
  if (!path) return '';

  let cleanPath = path.replace(/\\/g, '/');

  // Check if active Supabase URL is set
  const activeSupaUrl = import.meta.env.VITE_SUPABASE_URL || supabaseUrl;
  const isSupabaseActive = Boolean(activeSupaUrl && !activeSupaUrl.includes('placeholder.supabase.co'));

  // If path is a localhost URL or relative path AND Supabase is active, construct Supabase Storage URL
  if (isSupabaseActive && (cleanPath.includes('localhost') || cleanPath.includes('127.0.0.1') || !cleanPath.startsWith('http'))) {
    const rawFileName = cleanPath.split('/').pop();
    let fileName = rawFileName;
    try { fileName = decodeURIComponent(rawFileName); } catch (_) {}

    let bucket = 'uploads';
    if (type === 'resume' || cleanPath.includes('resumes') || fileName.endsWith('.pdf') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      bucket = 'resumes';
    } else if (type === 'brochure' || cleanPath.includes('brochures')) {
      bucket = 'brochures';
    }

    try {
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      if (publicData?.publicUrl) {
        return publicData.publicUrl;
      }
    } catch (_) {
      // Fallback if Supabase call fails
    }
  }

  // If already an absolute http/https/data URL (and not redirected localhost), return as is
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://') || cleanPath.startsWith('data:')) {
    return cleanPath;
  }

  if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);

  // If path is just a filename (e.g. "document.docx") without "uploads/" prefix, auto-format
  if (!cleanPath.startsWith('uploads/')) {
    if (type === 'resume' || cleanPath.endsWith('.pdf') || cleanPath.endsWith('.doc') || cleanPath.endsWith('.docx')) {
      cleanPath = `uploads/resumes/${cleanPath}`;
    } else if (type === 'brochure') {
      cleanPath = `uploads/brochures/${cleanPath}`;
    } else {
      cleanPath = `uploads/${cleanPath}`;
    }
  }

  return `${UPLOADS_BASE_URL}/${cleanPath}`;
}

