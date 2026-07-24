import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  avatarId: {
    type: String, // Cloudinary URL or Appwrite File ID
    default: ''
  },
  appwriteId: { type: String }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
