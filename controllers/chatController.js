import Message from '../models/Message.js';
import User from '../models/User.js';

export const sendMessage = async (req, res) => {
  const { receiverId } = req.params;
  const { content } = req.body;
  const senderId = req.user._id;
  try {
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    if (!receiver.friends.includes(senderId)) {
      return res.status(403).json({ error: 'Receiver is not your friend' });
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });
    await message.save();

    // Emit message via Socket.IO 
    req.app.get('io').to(receiverId.toString()).emit('newMessage', {
      _id: message._id,
      sender: senderId,
      receiver: receiverId,
      content,
      timestamp: message.timestamp,
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: `Failed to send message: ${error.message}` });
  }
};

export const getChatHistory = async (req, res) => {
  const { friendId } = req.params;
  const userId = req.user._id;
  try {
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ error: 'Friend not found' });
    }

    if (!friend.friends.includes(userId)) {
      return res.status(403).json({ error: 'User is not your friend' });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    })
      .populate('sender', 'username profilePicture')
      .populate('receiver', 'username profilePicture')
      .sort('timestamp')
      .lean();

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch chat history: ${error.message}` });
  }
};