import { refreshAccessToken } from '../../../lib/auth';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  }

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    // Generate new access token
    const newAccessToken = refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
      },
    });

  } catch (error) {
    console.error('Token refresh error:', error);

    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
