import { connectDB } from '../lib/mongodb.js';
import User from '../models/User.js';

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB successfully!');

    // Create indexes
    console.log('Creating database indexes...');
    await User.createIndexes();
    console.log('Indexes created successfully!');

    // Test creating a user (optional)
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const existingUser = await User.findOne({ email: testUser.email });
    if (!existingUser) {
      const user = new User(testUser);
      await user.save();
      console.log('Test user created successfully!');
    } else {
      console.log('Test user already exists.');
    }

    console.log('\nDatabase initialization completed!');
    console.log('You can now:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Visit http://localhost:3000/auth to test authentication');
    console.log('3. Visit http://localhost:3000/api/test-db to test the API');
    
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
