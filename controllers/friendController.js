import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

export const sendFriendRequest = async (req, res) => {
  const { userId } = req.params;
  const senderId = req.user._id;
  try {
    if (senderId.toString() === userId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    const [sender, receiver] = await Promise.all([
      User.findById(senderId).select('friends'),
      User.findById(userId),
    ]);

    if (!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (sender.friends.includes(userId)) {
      return res.status(400).json({ error: 'User is already your friend' });
    }

    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: userId,
      status: 'pending',
    });
    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }

    const reverseRequest = await FriendRequest.findOne({
      sender: userId,
      receiver: senderId,
      status: 'pending',
    });
    if (reverseRequest) {
      return res.status(400).json({ error: 'User has already sent you a friend request' });
    }

    const friendRequest = new FriendRequest({
      sender: senderId,
      receiver: userId,
    });
    await friendRequest.save();

    receiver.friendRequests.push(friendRequest._id);
    await receiver.save();

    res.json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ error: `Failed to send friend request: ${error.message}` });
  }
}

export const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user._id;
  try {
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest || friendRequest.receiver.toString() !== userId.toString()) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Friend request already processed' });
    }

    friendRequest.status = 'accepted';
    const user = await User.findById(userId);
    const friend = await User.findById(friendRequest.sender);
    user.friends.push(friendRequest.sender);
    friend.friends.push(userId);

    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== requestId
    );

    await Promise.all([friendRequest.save(), user.save(), friend.save()]);
    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ error: `Failed to accept friend request: ${error.message}` });
  }
}

export const getFriendRequests = async (req, res) => {
  const userId = req.user._id;
  try {
    const friendRequests = await FriendRequest.find({ receiver: userId, status: 'pending' })
      .populate('sender', 'username profilePicture')
      .lean();
    res.json(friendRequests);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch friend requests: ${error.message}` });
  }
}

export const getFriends = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId)
      .select('friends')
      .populate('friends', 'username profilePicture')
      .lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch friends: ${error.message}` });
  }
}