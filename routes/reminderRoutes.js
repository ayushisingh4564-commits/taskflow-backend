import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getReminders, getOverdue, createReminder, deleteReminder
} from '../controllers/reminderController.js';

const router = Router();

router.use(protect);
router.get('/', getReminders);
router.get('/overdue', getOverdue);
router.post('/', createReminder);
router.delete('/:id', deleteReminder);

export default router;