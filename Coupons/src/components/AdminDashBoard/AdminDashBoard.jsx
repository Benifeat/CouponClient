// components/AdminDashboard/AdminDashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    Tag,
    BarChart2,
    Users,
    ChevronDown,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCoupons } from '../../context/CouponContext';
import CouponManagement from './CouponManagement';
import Reports from './Reports';
import UserManagement from './UserManagement/UserManagement';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { loading: couponsLoading } = useCoupons();
    const [activeTab, setActiveTab] = useState('coupons');
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Redirect if not authenticated
    if (!user) {
        navigate('/');
        return null;
    }

    const tabs = [
        {
            id: 'coupons',
            label: 'Coupons Management',
            icon: <Tag className="w-5 h-5" />,
            component: <CouponManagement />,
            allowedRoles: ['admin', 'user']
        },
        {
            id: 'reports',
            label: 'Reports & Analytics',
            icon: <BarChart2 className="w-5 h-5" />,
            component: <Reports />,
            allowedRoles: ['admin']
        },
        {
            id: 'users',
            label: 'User Management',
            icon: <Users className="w-5 h-5" />,
            component: <UserManagement />,
            allowedRoles: ['admin']
        }
    ];

    const allowedTabs = tabs.filter(tab =>
        tab.allowedRoles.includes(user?.role || 'user')
    );

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navigation Bar */}
            <nav className="bg-gray-900 text-white sticky top-0 z-50">
                <div className="max-w-full px-4 mx-auto">
                    <div className="flex items-center justify-between h-16">
                        {/* Left side - Home button */}
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
                        >
                            <Home size={20} />
                            <span>Home</span>
                        </button>

                        {/* Right side - User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                    {user.email[0].toUpperCase()}
                                </div>
                                <span>{user.email}</span>
                                <ChevronDown size={16} />
                            </button>

                            {/* Dropdown menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-full">
                {/* Tab Navigation */}
                <div className="bg-white border-b">
                    <div className="max-w-full px-4">
                        <nav className="-mb-px flex space-x-8 overflow-x-auto">
                            {allowedTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                                        ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                        transition-colors duration-200
                                    `}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <main className="w-full h-full px-4 py-6">
                    {couponsLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow">
                            {allowedTabs.find(tab => tab.id === activeTab)?.component}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;