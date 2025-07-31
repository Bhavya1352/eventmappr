import { runMiddleware, authenticate } from '../../../middleware/auth';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  }

  try {
    // Run authentication middleware
    await runMiddleware(req, res, authenticate);

    // If we reach here, the user is authenticated
    const userResponse = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isVerified: req.user.isVerified,
      lastLogin: req.user.lastLogin,
      createdAt: req.user.createdAt,
      preferences: req.user.preferences,
    };

    res.status(200).json({
      success: true,
      message: 'User authenticated',
      data: {
        user: userResponse,
      },
    });

  } catch (error) {
    console.error('Me endpoint error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
