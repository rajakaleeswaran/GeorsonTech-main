import multer from 'multer';
import path from 'path';

// Memory storage for Vercel serverless / zero local filesystem dependency
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype) || file.mimetype.startsWith('image/');

  if (extname || mimetype) {
    return cb(null, true);
  }
  cb(new Error('Error: Only images (JPEG/JPG/PNG/WEBP/GIF), PDFs, and Word Documents (DOC/DOCX) are allowed!'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: fileFilter
});

export default upload;

