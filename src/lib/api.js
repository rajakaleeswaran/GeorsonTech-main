import { supabase, supabaseUrl } from './supabase';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:5000';

/**
 * Resolves full asset URL for uploaded files, resumes, or remote image URLs.
 * Always prioritizes direct public Supabase Storage URLs.
 * @param {string} path
 * @param {string} [type] Optional asset type: 'resume' | 'image' | 'brochure'
 * @returns {string}
 */
export function getAssetUrl(path, type = 'general') {
  if (!path) return '';

  let cleanPath = path.replace(/\\/g, '/').trim();

  // If already an absolute HTTP/HTTPS URL or data URL -> return as-is
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://') || cleanPath.startsWith('data:')) {
    return cleanPath;
  }

  // Check if Supabase is configured
  const activeSupaUrl = import.meta.env.VITE_SUPABASE_URL || supabaseUrl;
  if (activeSupaUrl && !activeSupaUrl.includes('placeholder.supabase.co')) {
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

    const rawFileName = cleanPath.split('/').pop();
    let fileName = rawFileName;
    try { fileName = decodeURIComponent(rawFileName); } catch (_) {}

    if (fileName) {
      return `${activeSupaUrl}/storage/v1/object/public/${bucket}/${encodeURIComponent(fileName)}`;
    }
  }

  // Fallback if not absolute and Supabase inactive
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


