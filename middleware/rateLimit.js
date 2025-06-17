export default (req, res, next) => {
  const limit = 100; // requests per minute
  const windowMs = 60 * 1000;
  req.rateLimit = req.rateLimit || { count: 0, resetTime: Date.now() };
  if (Date.now() > req.rateLimit.resetTime + windowMs) {
    req.rateLimit.count = 0;
    req.rateLimit.resetTime = Date.now();
  }
  if (req.rateLimit.count >= limit) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  req.rateLimit.count++;
  next();
};