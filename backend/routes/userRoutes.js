import express from 'express';
import {
  getUserProfile,
  getProfiles,
  updateProfile,
  updateBookmarks,
  getBookmarks,
  followUser,
  unfollowUser,
  checkFollowStatus,
  getFollowersCount,
  getFollowingCount,
  getFollowersList
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Profile
router.get('/profiles', getProfiles);
router.get('/profile/:userId', getUserProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);

// Bookmarks
router.route('/bookmarks')
  .get(protect, getBookmarks)
  .put(protect, updateBookmarks);

// Followers
router.post('/follow', protect, followUser);
router.post('/unfollow', protect, unfollowUser);
router.get('/follow/status/:targetUserId', protect, checkFollowStatus);
router.get('/followers/count/:targetUserId', getFollowersCount);
router.get('/following/count/:targetUserId', getFollowingCount);
router.get('/followers/list/:targetUserId', getFollowersList);

export default router;
