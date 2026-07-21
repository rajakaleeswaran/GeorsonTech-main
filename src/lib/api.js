/**
 * @file api.js
 * @description Central API configuration and URL resolution helpers.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:5000';

/**
 * Resolves full asset URL for uploaded files, resumes, or remote image URLs
 * @param {string} path 
 * @param {string} [type] Optional asset type: 'resume' | 'image' | 'brochure'
 * @returns {string}
 */
export function getAssetUrl(path, type = 'general') {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  let cleanPath = path.replace(/\\/g, '/');
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
