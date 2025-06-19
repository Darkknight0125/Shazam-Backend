import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import { JWT_SECRET } from '../config/index.js';

// Default avatar URLs 
const defaultAvatars = [
  'https://res.cloudinary.com/dcfefgcgs/image/upload/v1750363966/5_femmwj.jpg',
  'https://res.cloudinary.com/dcfefgcgs/image/upload/v1750363964/7_cb2i5p.jpg',
  'https://res.cloudinary.com/dcfefgcgs/image/upload/v1750363963/6_urc4qm.jpg',
  'https://res.cloudinary.com/dcfefgcgs/image/upload/v1750363962/3_ge3pp4.jpg',
  'https://res.cloudinary.com/dcfefgcgs/image/upload/v1750363962/4_kin7z4.jpg',
  'https://res.cloudinary.com/dcfefgcgs/image/upload/v1750363962/2_agn2mm.jpg',
  'https://res.cloudinary.com/dcfefgcgs/image/upload/v1750363961/1_j9wmjx.jpg'
];

export const signup = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
    const user = new User({
      email,
      username,
      password: hashedPassword,
      profilePicture: randomAvatar,
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username, email, profilePicture: user.profilePicture } });
  } catch (error) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, email, profilePicture: user.profilePicture } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const editProfile = async (req, res) => {
  const { username } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { username } },
      { new: true, runValidators: true }
    ).select('-password -friends -friendRequests -playlists -moodHistory');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: { id: user._id, username: user.username, email: user.email, profilePicture: user.profilePicture } });
  } 
  catch (error) {
    res.status(400).json({ error: 'Username already exists or invalid data' });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const userId = req.user._id;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.profilePicture && !defaultAvatars.includes(user.profilePicture)) {
      const publicId = user.profilePicture.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'profile_pictures', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    user.profilePicture = result.secure_url;
    await user.save();

    res.json({ user: { id: user._id, username: user.username, email: user.email, profilePicture: user.profilePicture } });
  } 
  catch (error) {
    res.status(500).json({ error: `Failed to upload profile picture: ${error.message}` });
  }
};

export const getProfile = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select('-password -friends -friendRequests -playlists -moodHistory');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: { id: user._id, username: user.username, email: user.email, profilePicture: user.profilePicture } });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch profile: ${error.message}` });
  }
};