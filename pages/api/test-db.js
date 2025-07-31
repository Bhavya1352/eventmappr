import { connectDB } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    res.status(200).json({
      success: true,
      message: 'MongoDB connection successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    res.status(500).json({
      success: false,
      message: 'MongoDB connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Database connection error',
    });
  }
}
