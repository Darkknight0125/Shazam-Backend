import Thread from '../models/Thread.js';
import Post from '../models/Post.js';

export const createThread = async (req, res) => {
  const { title, contentType } = req.body;
  try {
    const thread = new Thread({
      title,
      creator: req.user._id,
    });
    await thread.save();
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create thread' });
  }
};

export const createPost = async (req, res) => {
  const { threadId } = req.params;
  const { content } = req.body;
  try {
    const post = new Post({
      thread: threadId,
      author: req.user._id,
      content,
    });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getThread = async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findById(threadId)
      .populate('creator', 'username')
      .lean();
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    const posts = await Post.find({ thread: threadId })
      .populate('author', 'username')
      .lean();
    const threadWithPosts = { ...thread, posts };
    res.json(threadWithPosts);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch thread: ${error.message}` });
  }
};