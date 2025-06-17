import User from '../models/User.js';
import Message from '../models/Message.js';

export const sendFriendRequest = async (req, res) => {
  const { userId } = req.params;
  try {
    const friend = await User.findById(userId);
    if (!friend) return res.status(404).json({ error: 'User not found' });
    friend.friendRequests.push(req.user._id);
    await friend.save();
    res.json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send friend request' });
  }
};

export const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    req.user.friendRequests = req.user.friendRequests.filter(
      (id) => id.toString() !== requestId
    );
    req.user.friends.push(requestId);
    const friend = await User.findById(requestId);
    friend.friends.push(req.user._id);
    await Promise.all([req.user.save(), friend.save()]);
    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
};

export const getChatHistory = async (req, res) => {
  const { friendId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: friendId },
        { sender: friendId, receiver: req.user._id },
      ],
    }).sort('timestamp');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};