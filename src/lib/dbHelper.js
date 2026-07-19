/**
 * @file dbHelper.js
 * @description Standard helper for querying, updating, and saving data.
 * Checks if local backend is active; if down (e.g. live on Vercel), fallback queries Supabase.
 */
import { supabase } from './supabase';

const API_BASE = 'http://localhost:5000/api';

/**
 * Format asset URLs (Supabase storage public URLs vs local backend uploads)
 */
export function getAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `http://localhost:5000/${cleanPath}`;
}

/**
 * Perform a fetch to the backend or fallback to Supabase
 * @param {string} endpoint - The backend API path (e.g. '/services')
 * @param {string} supabaseTable - The Supabase table name (e.g. 'services')
 * @param {object} options - Optional queries or headers
 */
export async function fetchCollection(endpoint, supabaseTable, selectQuery = '*') {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) || typeof data === 'object') {
        return data;
      }
    }
  } catch (err) {
    console.warn(`Local backend down for ${endpoint}. Querying Supabase cloud DB instead.`);
  }

  // Supabase fallback
  const { data, error } = await supabase
    .from(supabaseTable)
    .select(selectQuery);
  
  if (error) {
    console.error(`Supabase error for table ${supabaseTable}:`, error);
    return [];
  }
  return data;
}

/**
 * Handle enquiry submission
 */
export async function submitEnquiry(enquiryForm) {
  // 1. Submit to Supabase directly (guarantees saving to Cloud DB)
  const { error } = await supabase
    .from('enquiries')
    .insert([{
      name: enquiryForm.name,
      company: enquiryForm.company,
      email: enquiryForm.email,
      phone: enquiryForm.phone,
      subject: enquiryForm.subject,
      service_interested: enquiryForm.serviceInterested,
      message: enquiryForm.message,
      status: 'Pending'
    }]);

  if (error) throw error;

  // 2. Submit to local backend if online (to trigger local Node SMTP emails)
  try {
    await fetch(`${API_BASE}/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryForm)
    });
  } catch (err) {
    console.log('Local backend is offline; SMTP email not sent, but successfully stored in Supabase.');
  }

  return { success: true };
}

/**
 * Handle career application submission
 */
export async function submitCareerApplication(careerForm, resumeFile) {
  let resumePath = '';

  // Upload resume file to Supabase storage if possible
  if (resumeFile) {
    try {
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile);

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(fileName);
        resumePath = publicUrl;
      } else {
        // Fallback placeholder path if storage bucket doesn't exist
        resumePath = `uploads/resumes/${resumeFile.name}`;
      }
    } catch (e) {
      resumePath = `uploads/resumes/${resumeFile.name}`;
    }
  }

  // 1. Save record in Supabase career_applications table
  const { error } = await supabase
    .from('career_applications')
    .insert([{
      name: careerForm.name,
      email: careerForm.email,
      phone: careerForm.phone,
      qualification: careerForm.qualification,
      experience: careerForm.experience,
      resume_path: resumePath,
      cover_letter: careerForm.coverLetter,
      status: 'Pending'
    }]);

  if (error) throw error;

  // 2. Fallback backend call (for backend's Nodemailer to trigger attachment email)
  try {
    const formData = new FormData();
    formData.append('name', careerForm.name);
    formData.append('email', careerForm.email);
    formData.append('phone', careerForm.phone);
    formData.append('qualification', careerForm.qualification);
    formData.append('experience', careerForm.experience);
    formData.append('coverLetter', careerForm.coverLetter);
    formData.append('resume', resumeFile);

    await fetch(`${API_BASE}/career`, {
      method: 'POST',
      body: formData
    });
  } catch (err) {
    console.log('Local backend is offline; career application stored in Supabase.');
  }

  return { success: true };
}
