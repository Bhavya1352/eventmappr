# MongoDB Authentication Setup for EventMappr

This document explains how to set up and use the MongoDB authentication system in EventMappr.

## Prerequisites

1. **MongoDB**: Install MongoDB locally or use MongoDB Atlas (cloud)
2. **Node.js dependencies**: Already installed via `npm install`

## Environment Configuration

1. Copy `.env.local` and update the MongoDB connection string:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/eventmappr

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eventmappr?retryWrites=true&w=majority

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
```

## MongoDB Setup Options

### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service: `mongod`
3. Use the connection string: `mongodb://localhost:27017/eventmappr`

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Get your connection string from the "Connect" button
5. Replace `<password>` with your database user password

## API Endpoints

The following authentication endpoints are available:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/me` - Get current user info (requires authentication)
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/test-db` - Test MongoDB connection

## Usage Examples

### Registration
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});
```

### Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});
```

### Using the Auth Context
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <div>Welcome, {user.name}!</div>;
  }
  
  return <div>Please log in</div>;
}
```

## Testing the Setup

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000/api/test-db` to test MongoDB connection
3. Visit `http://localhost:3000/auth` to test registration/login
4. Visit `http://localhost:3000/dashboard` to see user dashboard

## Features

- ✅ User registration and login
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Refresh token support
- ✅ User profile management
- ✅ Protected routes
- ✅ React context for state management
- ✅ Responsive auth UI

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Input validation and sanitization
- Protected API routes
- Secure cookie handling (can be implemented)
- Rate limiting (can be implemented)

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: 'user'),
  isVerified: Boolean (default: false),
  createdAt: Date,
  lastLogin: Date,
  preferences: {
    notifications: Boolean,
    theme: String
  }
}
```

## Development vs Production

### Development
- Uses demo Firebase config if MongoDB is not configured
- Detailed error messages
- Debug logging enabled

### Production
- Requires proper MongoDB connection
- Minimal error messages
- Secure JWT secrets
- Environment variable validation

## Troubleshooting

1. **MongoDB Connection Error**: Check your connection string and ensure MongoDB is running
2. **JWT Error**: Ensure JWT_SECRET is set and at least 32 characters long
3. **CORS Issues**: API routes are configured for same-origin requests
4. **Authentication Not Working**: Check browser dev tools for network errors

## Migration from Firebase

The existing Firebase authentication can coexist with MongoDB auth. Users can choose which authentication method to use. To fully migrate:

1. Export user data from Firebase
2. Create migration script to import users to MongoDB
3. Update frontend to use MongoDB auth exclusively
4. Remove Firebase dependencies (optional)
