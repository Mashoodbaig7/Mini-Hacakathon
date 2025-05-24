import { useState } from 'react';
import { eventAPI } from '../services/api';

const UserStatus = () => {
  const [email, setEmail] = useState('');
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const allRequests = await eventAPI.getAllRequests();
      const filteredRequests = allRequests.filter(req => req.email.toLowerCase() === email.toLowerCase());

      if (filteredRequests.length === 0) {
        setMessage('No requests found for this email');
        setUserRequests([]);
      } else {
        setUserRequests(filteredRequests);
        setMessage('');
      }
    } catch (error) {
      setMessage('Error fetching requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = (request) => {
    switch (request.status) {
      case 'pending':
        return 'Your request is pending approval';
      case 'accepted':
        return 'Your request has been accepted!';
      case 'declined':
        return 'Your request has been declined';
      case 'updated':
        return `Your appointment has been updated to: ${request.updatedDate}`;
      default:
        return 'Status unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return '#4CAF50';
      case 'declined': return '#f44336';
      case 'pending': return '#ff9800';
      case 'updated': return '#9c27b0';
      default: return '#757575';
    }
  };

  return (
    <div className="user-status-container">
      <h2>Check Your Request Status</h2>

      <form onSubmit={handleSearch} className="status-search-form">
        <div className="form-group">
          <label>Enter your email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Check Status'}
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'info'}`}>
          {message}
        </div>
      )}

      {userRequests.length > 0 && (
        <div className="user-requests">
          <h3>Your Requests:</h3>
          {userRequests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-info">
                <p><strong>Date:</strong> {request.date}</p>
                <p><strong>Description:</strong> {request.description}</p>
                <p><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="request-status">
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(request.status) }}
                >
                  {request.status.toUpperCase()}
                </span>
                <p className="status-message">{getStatusMessage(request)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserStatus;