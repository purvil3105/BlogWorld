import express from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
  getFollowingFeed,
  getUserPosts,
  updatePostInteractions,
  getTrendingPosts,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, upload.single('featuredimage'), createPost);

router.get('/following', protect, getFollowingFeed);
router.get('/trending', getTrendingPosts);

router.route('/:id')
  .put(protect, upload.single('featuredimage'), updatePost)
  .delete(protect, deletePost);

router.put('/:id/interactions', protect, updatePostInteractions);
router.get('/user/:userId', getUserPosts);

router.get('/slug/:slug', getPost);

export default router;
