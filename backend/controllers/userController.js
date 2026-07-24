import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Follower from '../models/Follower.js';

// Profile operations
export const getUserProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId }).populate('userId', 'name email');
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const getProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find().populate('userId', 'name email');
    res.json(profiles);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.name = req.body.name || profile.name;
    profile.bio = req.body.bio || profile.bio;
    profile.country = req.body.country || profile.country;
    profile.twitter = req.body.twitter || profile.twitter;
    profile.github = req.body.github || profile.github;
    profile.linkedin = req.body.linkedin || profile.linkedin;
    profile.website = req.body.website || profile.website;

    if (req.file) {
      profile.avatarId = req.file.path;
    }

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

// Bookmarks operations
export const updateBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Expect an array of post IDs
    user.bookmarks = req.body.bookmarks || user.bookmarks;
    await user.save();
    
    res.json(user.bookmarks);
  } catch (error) {
    next(error);
  }
};

export const getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.bookmarks);
  } catch (error) {
    next(error);
  }
};

// Follow operations
export const followUser = async (req, res, next) => {
  try {
    const { targetUserId } = req.body;
    
    if (req.user._id.toString() === targetUserId) {
       return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const existingFollow = await Follower.findOne({
      followerId: req.user._id,
      followingId: targetUserId
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following' });
    }

    await Follower.create({
      followerId: req.user._id,
      followingId: targetUserId
    });

    res.status(201).json({ message: 'Followed successfully' });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const { targetUserId } = req.body;
    
    await Follower.findOneAndDelete({
      followerId: req.user._id,
      followingId: targetUserId
    });

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    next(error);
  }
};

export const checkFollowStatus = async (req, res, next) => {
    try {
        const { targetUserId } = req.params;
        const follow = await Follower.findOne({
            followerId: req.user._id,
            followingId: targetUserId
        });
        res.json({ isFollowing: !!follow });
    } catch (error) {
        next(error);
    }
};

export const getFollowersCount = async (req, res, next) => {
    try {
        const { targetUserId } = req.params;
        const count = await Follower.countDocuments({ followingId: targetUserId });
        res.json({ count });
    } catch (error) {
        next(error);
    }
};

export const getFollowingCount = async (req, res, next) => {
    try {
        const { targetUserId } = req.params;
        const count = await Follower.countDocuments({ followerId: targetUserId });
        res.json({ count });
    } catch (error) {
        next(error);
    }
};

export const getFollowersList = async (req, res, next) => {
    try {
        const { targetUserId } = req.params;
        const followers = await Follower.find({ followingId: targetUserId }).populate('followerId', 'name');
        
        const formattedFollowers = followers.map(f => ({
            _id: f._id,
            followerId: f.followerId ? f.followerId._id : null,
            followerName: f.followerId ? f.followerId.name : 'Unknown',
            followingId: f.followingId
        }));
        
        res.json(formattedFollowers);
    } catch (error) {
        next(error);
    }
};
