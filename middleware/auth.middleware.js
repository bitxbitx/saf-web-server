const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenHeader = authHeader?.split(' ')[1];
  const token = tokenHeader || req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      console.error(err);
      return res.status(401).json({ error: 'Not authorized, invalid token' });
    } else if (err instanceof jwt.TokenExpiredError) {
      console.error(err);
      return res.status(403).json({ error: 'Not authorized, token expired' });
    } else {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = { protect };
