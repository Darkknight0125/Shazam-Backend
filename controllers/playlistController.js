import Playlist from '../models/Playlist.js';
import User from '../models/User.js';

export const createPlaylist = async (req, res) => {
  const { name, description, content, isPublic } = req.body;
  try {
    const playlist = new Playlist({
      name,
      description,
      creator: req.user._id,
      content,
      isPublic,
    });
    await playlist.save();
    req.user.playlists.push(playlist._id);
    await req.user.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create playlist' });
  }
};

export const getPlaylist = async (req, res) => {
  const { id } = req.params;
  try {
    const playlist = await Playlist.findById(id).populate('creator', 'username');
    if (!playlist || (!playlist.isPublic && !req.user?.friends.includes(playlist.creator))) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
};