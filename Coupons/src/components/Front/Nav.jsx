import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, X } from 'lucide-react';
import Login from './Login';

const Nav = ({
    isLoggedIn,
    user,
    onLogin,
    onLogout,
    showLoginForm,
    setShowLoginForm,
    onLoginFormClose
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.user-menu')) {
                setShowDropdown(false);
            }
            if (showLoginForm && !event.target.closest('.login-form') && !event.target.closest('.login-button')) {
                handleLoginFormClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown, showLoginForm]);
    const handleMenuClick = () => {
        setShowDropdown(!showDropdown);
    };
    const handleDashboardClick = () => {
        navigate('/dashboard');
        setShowDropdown(false);
    };
    const handleHomeClick = () => {
        navigate('/');
        setShowDropdown(false);
    };

    const handleLogoutClick = () => {
        onLogout();
        setShowDropdown(false);
        navigate('/');
    };

    const handleLoginSuccess = async (email, password) => {
        const success = await onLogin(email, password);
        if (success) {
            setShowLoginForm(false);
        }
        return success;
    };

    const handleLoginFormClose = () => {
        setShowLoginForm(false);
        if (onLoginFormClose) {
            onLoginFormClose();
        }
    };

    return (
        <div className="w-full fixed top-0 z-[100]">
            <nav className="bg-gray-900 text-gray-300 p-3">
                <div className="flex justify-between items-center px-4">
                    {/* Home button */}
                    <button
                        onClick={handleHomeClick}
                        className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                    >
                        <Home size={20} />
                        <span>Home</span>
                    </button>

                    {/* Login/User Menu */}
                    <div>
                        {isLoggedIn ? (
                            <div className="relative user-menu">
                                <button
                                    onClick={handleMenuClick}
                                    className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                                >
                                    <Menu size={20} />
                                    <span>{user?.email}</span>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <button
                                            onClick={handleDashboardClick}
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            Dashboard
                                        </button>
                                        <hr className="my-1" />
                                        <button
                                            onClick={handleLogoutClick}
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span>Already have an account?</span>
                                <button
                                    onClick={() => setShowLoginForm(true)}
                                    className="login-button bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                                >
                                    Login
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Login form */}
            {showLoginForm && !isLoggedIn && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[101] flex items-start justify-center">
                    <div className="login-form mt-20 bg-white rounded-lg shadow-lg p-6 w-96 relative">
                        {/* Close button  most important!*/}
                        <button
                            onClick={handleLoginFormClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Login user*/}
                        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                            Login to Your Account
                        </h2>

                        <Login
                            onLogin={handleLoginSuccess}
                            isDropdown={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Nav;