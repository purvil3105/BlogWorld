import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  appwriteId: {
    type: String, // To help with migration mapping
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
