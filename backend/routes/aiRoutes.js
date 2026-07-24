import express from 'express';
import { writerChat, generateCoverImage } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/writer-chat', protect, writerChat);
router.post('/writer-chat/cover-image', protect, generateCoverImage);

export default router;
