//main app with the usage of routes and different pages and tabs
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import AdminDashboard from './components/AdminDashBoard/AdminDashBoard';
import Nav from './components/Front/Nav';
import { authenticateUser } from './auth/Auth';

function App() {
  const [user, setUser] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [pendingCouponCode, setPendingCouponCode] = useState(null);
  const [activeTab, setActiveTab] = useState('anonymous');
  //handle login authentication sending for check
  const handleLogin = async (email, password) => {
    try {
      const authenticatedUser = await authenticateUser(email, password);
      setUser(authenticatedUser);
      setShowLoginForm(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };
  //handle logout authentication
  const handleLogout = () => {
    setUser(null);
    setPendingCouponCode(null);
    setActiveTab('anonymous');
  };
  //dispaly login form
  const toggleLoginForm = (couponCode = null) => {
    if (couponCode) {
      setPendingCouponCode(couponCode);
    }
    setShowLoginForm(!showLoginForm);
  };
  // close the form
  const handleLoginFormClose = () => {
    setShowLoginForm(false);
    setActiveTab('anonymous');
    setPendingCouponCode(null);
  };

  return (
    <>
      {/* navbar */}
      <Nav
        isLoggedIn={!!user}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        showLoginForm={showLoginForm}
        setShowLoginForm={setShowLoginForm}
        onLoginFormClose={handleLoginFormClose}
      />
      <Routes>
        {/* home page */}
        <Route
          path="/"
          element={
            <HomePage
              isLoggedIn={!!user}
              userEmail={user?.email}
              toggleLoginForm={toggleLoginForm}
              pendingCouponCode={pendingCouponCode}
              setPendingCouponCode={setPendingCouponCode}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onLoginFormClose={handleLoginFormClose}
            />
          }
        />
        {/* admin dashboard when autherized */}
        <Route
          path="/dashboard"
          element={
            user?.role === 'admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;