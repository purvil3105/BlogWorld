import Activity from '../models/Activity.js';
import User from '../models/User.js';

export const logActivity = async (req, res, next) => {
  try {
    const { userId, type, targetId, message } = req.body;

    // Optional validation
    if (!userId || !type || !targetId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const activity = await Activity.create({
      userId,
      type,
      targetId,
      message
    });

    res.status(201).json(activity);
  } catch (error) {
    next(error);
  }
};

export const getUserActivity = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Fetch last 20 activities for the user, sorted by newest first
    const activities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('userId', 'name');

    // Return in Appwrite-like structure for frontend compatibility
    res.json({ documents: activities.map(act => ({ $id: act._id, ...act._doc })) });
  } catch (error) {
    next(error);
  }
};
