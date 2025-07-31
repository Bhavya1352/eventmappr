import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

const UserDashboard = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="not-authenticated">
        <p>Please log in to access your dashboard.</p>
        <button onClick={() => router.push('/auth')}>Go to Login</button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      
      <div className="user-info">
        <h2>Your Profile</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Name:</label>
            <span>{user?.name}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{user?.email}</span>
          </div>
          <div className="info-item">
            <label>Role:</label>
            <span>{user?.role}</span>
          </div>
          <div className="info-item">
            <label>Account Status:</label>
            <span className={user?.isVerified ? 'verified' : 'unverified'}>
              {user?.isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
          <div className="info-item">
            <label>Member Since:</label>
            <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
          </div>
          {user?.lastLogin && (
            <div className="info-item">
              <label>Last Login:</label>
              <span>{new Date(user?.lastLogin).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .user-dashboard {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .dashboard-header h1 {
          color: #333;
          margin: 0;
        }

        .logout-btn {
          background: #ff4757;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .logout-btn:hover {
          background: #ff3742;
        }

        .user-info h2 {
          color: #333;
          margin-bottom: 1rem;
        }

        .info-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .info-item label {
          font-weight: 600;
          color: #555;
        }

        .info-item span {
          color: #333;
        }

        .verified {
          color: #28a745;
          font-weight: 600;
        }

        .unverified {
          color: #dc3545;
          font-weight: 600;
        }

        .loading, .not-authenticated {
          text-align: center;
          padding: 2rem;
        }

        .not-authenticated button {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 1rem;
        }

        .not-authenticated button:hover {
          background: #0056b3;
        }

        @media (max-width: 768px) {
          .user-dashboard {
            padding: 1rem;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
