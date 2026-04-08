import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getTasks, addTask, updateTask, deleteTask, toggleTask
} from '../controllers/taskController.js';

const router = Router();

router.use(protect);
router.get('/', getTasks);
router.post('/', addTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTask);

export default router;