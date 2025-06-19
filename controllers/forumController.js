import Thread from '../models/Thread.js';
import Post from '../models/Post.js';

export const createThread = async (req, res) => {
  const { contentId, title, contentType } = req.body;
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
    res.status(500).json({ error: `Failed to create thread: ${error.message}` });
  }
};

export const createPost = async (req, res) => {
  const { threadId } = req.params;
  const { content } = req.body;
  try {
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    const post = new Post({
      thread: threadId,
      author: req.user._id,
      content,
    });
    await post.save();
    thread.posts.push(post._id);
    await thread.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: `Failed to create post: ${error.message}` });
  }
};

export const getThread = async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findById(threadId)
      .populate('creator', 'username')
      .populate({
        path: 'posts',
        populate: { path: 'author', select: 'username' },
      })
      .lean();
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch thread: ${error.message}` });
  }
};