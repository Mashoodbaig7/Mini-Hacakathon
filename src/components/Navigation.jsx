const Navigation = ({ currentView, setCurrentView }) => {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h1>Event Booking System</h1>
      </div>
      <div className="nav-links">
        <button
          className={currentView === 'user' ? 'active' : ''}
          onClick={() => setCurrentView('user')}
        >
          Book Event
        </button>
        <button
          className={currentView === 'status' ? 'active' : ''}
          onClick={() => setCurrentView('status')}
        >
          Check Status
        </button>
        <button
          className={currentView === 'admin' ? 'active' : ''}
          onClick={() => setCurrentView('admin')}
        >
          Admin Panel
        </button>
      </div>
    </nav>
  );
};

export default Navigation;