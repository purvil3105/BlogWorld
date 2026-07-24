import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  featuredimage: {
    type: String, 
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  userId: {
    type: String, // Kept as String to perfectly match Appwrite or hold ObjectId strings seamlessly
    required: true,
  },
  category: {
    type: String,
  },
  likes: [{
    type: String,
  }],
  comments: {
    type: String,
  },
  authorName: {
    type: String,
  },
  trendingScore: {
    type: Number,
    default: 0,
  },
  authorAvatarId: {
    type: String,
  },
  appwriteId: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
