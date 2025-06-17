import Thread from '../models/Thread.js';
import Post from '../models/Post.js';

export const createThread = async (req, res) => {
  const { contentId } = req.params;
  const { title, contentType } = req.body;
  try {
    const thread = new Thread({
      contentId,
      contentType,
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

export const getThreads = async (req, res) => {
  const { contentId } = req.params;
  try {
    const threads = await Thread.find({ contentId }).populate('creator', 'username');
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
};