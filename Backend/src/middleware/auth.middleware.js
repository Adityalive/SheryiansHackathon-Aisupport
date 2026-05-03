import crypto from 'crypto';

const AUTH_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const [bodyB64, signature] = token.split('.');
    if (!bodyB64 || !signature) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(bodyB64)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return res.status(401).json({ message: 'Invalid token signature' });
    }

    const payload = JSON.parse(Buffer.from(bodyB64, 'base64url').toString('utf-8'));
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
