import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Setup directories
const uploadsDir = './uploads';
const resumeSubdir = './uploads/resumes';
const brochureSubdir = './uploads/brochures';
const imageSubdir = './uploads/images';

[uploadsDir, resumeSubdir, brochureSubdir, imageSubdir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      cb(null, resumeSubdir);
    } else if (file.fieldname === 'brochure') {
      cb(null, brochureSubdir);
    } else {
      cb(null, imageSubdir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Error: Only images (JPEG/JPG/PNG/GIF), PDFs, and Word Documents (DOC/DOCX) are allowed!'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

export default upload;
