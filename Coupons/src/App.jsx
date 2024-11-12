import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './pages/HomePage/HomePage';
import AdminDashboard from './components/AdminDashBoard/AdminDashBoard';
import Nav from './components/Front/Nav';
import { AuthProvider } from './context/AuthContext';
import { CouponProvider } from './context/CouponContext';
import { UserProvider } from './context/UserContext';

function App() {
  const [showLoginForm, setShowLoginForm] = useState(false);

  return (
    <AuthProvider>
      <UserProvider>
        <CouponProvider>
          <div className="min-h-screen bg-gray-100">
            <Nav showLoginForm={showLoginForm} setShowLoginForm={setShowLoginForm} />
            <Routes>
              <Route path="/" element={<HomePage setShowLoginForm={setShowLoginForm} />} />
              <Route
                path="/dashboard"
                element={<AdminDashboard />}
              />
            </Routes>
          </div>
        </CouponProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;