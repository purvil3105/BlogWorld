import express from 'express';
import { logActivity, getUserActivity } from '../controllers/activityController.js';

const router = express.Router();

router.post('/', logActivity);
router.get('/:userId', getUserActivity);

export default router;
