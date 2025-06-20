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
    res.status(500).json({ error: `Failed to create playlist: ${error.message}` });
  }
};

export const getPlaylist = async (req, res) => {
  const { id } = req.params;
  try {
    const playlist = await Playlist.findById(id).populate('creator', 'username');
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    if (!playlist.isPublic && !req.user?.friends.includes(playlist.creator._id.toString()) && playlist.creator._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch playlist: ${error.message}` });
  }
};

export const addMediaToPlaylist = async (req, res) => {
  const { id } = req.params;
  const { contentId, contentType } = req.body;
  try {
    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    if (playlist.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the creator can modify this playlist' });
    }
    if (playlist.content.some(item => item.contentId === contentId && item.type === contentType)) {
      return res.status(400).json({ error: 'Media already in playlist' });
    }
    
    playlist.content.push({ contentId, contentType });
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: `Failed to add media to playlist: ${error.message}` });
  }
};

export const togglePlaylistPublic = async (req, res) => {
  const { id } = req.params;
  try {
    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    if (playlist.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the creator can modify this playlist' });
    }
    playlist.isPublic = !playlist.isPublic;
    await playlist.save();
    res.json({ message: `Playlist is now ${playlist.isPublic ? 'public' : 'private'}`, playlist });
  } catch (error) {
    res.status(500).json({ error: `Failed to toggle playlist visibility: ${error.message}` });
  }
};