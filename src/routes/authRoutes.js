import { Router } from 'express';
import {
  register, login, verifyOTP, resendOTP
} from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/resend-otp', resendOTP);

export default router;