import Post from '../models/Post.js';
import User from '../models/User.js';
import Follower from '../models/Follower.js';

export const createPost = async (req, res, next) => {
  try {
    const { title, slug, content, status, category, authorName, authorAvatarId } = req.body;
    let featuredimage = req.body.featuredimage || '';

    if (req.file) {
      featuredimage = req.file.path; // Cloudinary URL
    }

    const post = await Post.create({
      title,
      slug,
      content,
      featuredimage,
      status,
      category,
      authorName,
      authorAvatarId,
      userId: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check user
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    post.title = req.body.title || post.title;
    post.slug = req.body.slug || post.slug;
    post.content = req.body.content || post.content;
    post.status = req.body.status || post.status;
    post.category = req.body.category || post.category;

    if (req.file) {
      post.featuredimage = req.file.path;
    } else if (req.body.featuredimage) {
      post.featuredimage = req.body.featuredimage;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    // We can fetch by ID or slug based on frontend needs. Let's do slug for flexibility.
    const post = await Post.findOne({ slug: req.params.slug }).populate('userId', 'name');
    
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: 'active' }).populate('userId', 'name').sort({ createdAt: -1 });
    res.json({ documents: posts }); // Format similar to Appwrite for easier frontend migration
  } catch (error) {
    next(error);
  }
};

export const getTrendingPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: 'active' })
      .populate('userId', 'name')
      .sort({ trendingScore: -1, createdAt: -1 })
      .limit(20);
    res.json({ documents: posts });
  } catch (error) {
    next(error);
  }
};

export const getFollowingFeed = async (req, res, next) => {
  try {
    const following = await Follower.find({ followerId: req.user._id }).select('followingId');
    const followingIds = following.map((f) => f.followingId);
    
    const posts = await Post.find({ 
      userId: { $in: followingIds },
      status: 'active'
    }).populate('userId', 'name').sort({ createdAt: -1 });
    
    res.json({ documents: posts });
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ 
      userId: req.params.userId,
      status: 'active'
    }).populate('userId', 'name').sort({ createdAt: -1 });
    
    res.json({ documents: posts });
  } catch (error) {
    next(error);
  }
};

export const updatePostInteractions = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (req.body.likes !== undefined) {
      post.likes = req.body.likes;
    }
    
    if (req.body.comments !== undefined) {
      post.comments = req.body.comments;
    }
    
    post.trendingScore = post.likes ? post.likes.length : 0;
    
    await post.save();
    res.json(post);
  } catch (error) {
    next(error);
  }
};
