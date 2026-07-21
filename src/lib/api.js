/**
 * @file api.js
 * @description Central API configuration and URL resolution helpers.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:5000';

/**
 * Resolves full asset URL for uploaded files or remote image URLs
 * @param {string} path 
 * @returns {string}
 */
export function getAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${UPLOADS_BASE_URL}/${cleanPath}`;
}
