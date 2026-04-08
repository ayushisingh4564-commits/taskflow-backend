import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ✅ Fix for ES Modules (__dirname not available by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Auto-create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // ✅ Absolute path — no more ENOENT errors
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'video/mp4', 'audio/mpeg', 'text/plain',
    'application/octet-stream', // ✅ Some browsers send this for .docx
    'application/zip'           // ✅ Some systems send this for Office files
  ];

  const allowedExtensions = [
    '.jpg', '.jpeg', '.png', '.gif',
    '.pdf', '.doc', '.docx',
    '.xls', '.xlsx',
    '.mp4', '.mp3', '.txt'
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  // ✅ Check BOTH mimetype AND extension — catches all browser variations
  if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype} (${ext})`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});