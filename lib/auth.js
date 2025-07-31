import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Extract token from request headers
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

// Generate access and refresh tokens
export const generateTokens = (userId) => {
  const payload = { userId };
  
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m', // Short-lived access token
  });
  
  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Long-lived refresh token
  });
  
  return { accessToken, refreshToken };
};

// Verify refresh token and generate new access token
export const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    return newAccessToken;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};
