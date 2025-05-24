import { useState } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import UserForm from './components/UserForm'
import UserStatus from './components/UserStatus'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'

function App() {
  const [currentView, setCurrentView] = useState('user')
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true)
  }

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false)
    setCurrentView('user')
  }

  const renderContent = () => {
    if (currentView === 'user') {
      return <UserForm />
    }

    if (currentView === 'status') {
      return <UserStatus />
    }

    if (currentView === 'admin') {
      if (isAdminLoggedIn) {
        return <AdminPanel onLogout={handleAdminLogout} />
      } else {
        return <AdminLogin onLogin={handleAdminLogin} />
      }
    }
  }

  return (
    <div className="app">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
