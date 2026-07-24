import mongoose from 'mongoose';

const followerSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followerName: {
    type: String,
  },
  followingName: {
    type: String,
  },
  appwriteId: { type: String }
}, { timestamps: true });

// Ensure a user can only follow another user once
followerSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export default mongoose.model('Follower', followerSchema);
