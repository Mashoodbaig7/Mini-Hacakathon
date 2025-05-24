import { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';

const AdminPanel = ({ onLogout }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpdateDate, setShowUpdateDate] = useState(null);
  const [updatedDate, setUpdatedDate] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await eventAPI.getAllRequests();
      setRequests(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await eventAPI.acceptRequest(id);
      setRequests(requests.map(req =>
        req._id === id ? { ...req, status: 'accepted' } : req
      ));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDecline = async (id) => {
    try {
      await eventAPI.declineRequest(id);
      setRequests(requests.map(req =>
        req._id === id ? { ...req, status: 'declined' } : req
      ));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateAppointment = async (id) => {
    try {
      if (!updatedDate) {
        setError('Please select a new date');
        return;
      }

      await eventAPI.updateAppointment(id, updatedDate);
      setRequests(requests.map(req =>
        req._id === id ? { ...req, status: 'updated', updatedDate: updatedDate } : req
      ));
      setShowUpdateDate(null);
      setUpdatedDate('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    onLogout();
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

  if (loading) return <div className="loading">Loading requests...</div>;

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && <div className="message error">{error}</div>}

      <div className="requests-summary">
        <div className="summary-item">
          <span>Total Requests: {requests.length}</span>
        </div>
        <div className="summary-item">
          <span>Pending: {requests.filter(r => r.status === 'pending').length}</span>
        </div>
        <div className="summary-item">
          <span>Accepted: {requests.filter(r => r.status === 'accepted').length}</span>
        </div>
        <div className="summary-item">
          <span>Declined: {requests.filter(r => r.status === 'declined').length}</span>
        </div>
        <div className="summary-item">
          <span>Updated: {requests.filter(r => r.status === 'updated').length}</span>
        </div>
      </div>

      <div className="requests-table">
        <h3>Event Requests</h3>
        {requests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date</th>
                <th>Updated Date</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>{request.name}</td>
                  <td>{request.email}</td>
                  <td>{request.date}</td>
                  <td>{request.updatedDate || '-'}</td>
                  <td className="description-cell">{request.description}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {request.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAccept(request._id)}
                          className="approve-btn"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDecline(request._id)}
                          className="reject-btn"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => setShowUpdateDate(request._id)}
                          className="reschedule-btn"
                        >
                          Update Appointment
                        </button>
                      </>
                    )}
                    {showUpdateDate === request._id && (
                      <div className="reschedule-form">
                        <input
                          type="date"
                          value={updatedDate}
                          onChange={(e) => setUpdatedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <button
                          onClick={() => handleUpdateAppointment(request._id)}
                          className="confirm-btn"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => {
                            setShowUpdateDate(null);
                            setUpdatedDate('');
                          }}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;