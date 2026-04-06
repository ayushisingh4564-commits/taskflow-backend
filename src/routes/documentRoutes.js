import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import { upload } from '../config/multer.js';
import {
  getDocuments, uploadDocument, deleteDocument, downloadDocument
} from '../controllers/documentController.js';

const router = Router();

router.use(protect);
router.get('/', getDocuments);
router.post('/', upload.single('file'), uploadDocument);
router.delete('/:id', deleteDocument);
router.get('/:id/download', downloadDocument);

export default router;