import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  targetId: {
    type: String, // String to handle both MongoDB ObjectIds and Appwrite IDs during transition
    required: true, 
  },
  message: {
    type: String,
  },
  appwriteId: { type: String }
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
