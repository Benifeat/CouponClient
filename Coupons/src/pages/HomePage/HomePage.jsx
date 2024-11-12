import { useState, useEffect } from 'react';
import Slider from '../../components/Slider/Slider';
import Checkout from '../../components/CheckOut/Checkout';
import { useAuth } from '../../context/AuthContext';
import { useCoupons } from '../../context/CouponContext';

// Import assets
import CheckoutBg from '../../assets/Confetti.png';

const HomePage = ({ setShowLoginForm }) => {
    const { user } = useAuth();
    const { coupons, loading } = useCoupons();
    const [selectedCoupon, setSelectedCoupon] = useState('');
    const [activeTab, setActiveTab] = useState('anonymous');

    // Handle coupon selection when user logs in
    useEffect(() => {
        if (!user) {
            setSelectedCoupon('');
        }
    }, [user]);

    // Handle login form for coupon from slider
    const handleCouponSelect = (couponCode) => {
        if (!user) {
            setShowLoginForm(true);
            return;
        }
        setSelectedCoupon(couponCode);
    };
    const handleMemberLoginClick = () => {
        setShowLoginForm(true);
        setActiveTab('login');
    };

    // Filter active coupons and ensure they have required advertisement data
    const activeCouponsWithAds = coupons.filter(coupon =>
        coupon.isActive &&
        coupon.advertisement &&
        coupon.image &&
        coupon.advertisement.backgroundImage
    );

    if (loading) {
        return (
            <div className="flex h-[100vh] bg-gray-100 mt-12 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (activeCouponsWithAds.length === 0) {
        return (
            <div className="flex h-[100vh] bg-gray-100 mt-12 items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Active Coupons</h2>
                    <p className="text-gray-600">Check back later for new offers!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-[100vh] bg-gray-100 mt-12">
            <div className="w-full md:w-[40%] bg-sky-300 p-4 md:p-8">
                <div className="h-full">
                    <Slider
                        coupons={activeCouponsWithAds}
                        onCouponSelect={handleCouponSelect}
                        isLoggedIn={!!user}
                    />
                </div>
            </div>
            <div
                className="flex justify-center items-center w-full md:w-[60%] p-4 md:p-8 relative"
                style={{
                    background: `linear-gradient(rgba(251, 191, 36, 0.8), rgba(251, 191, 36, 0.8)), url(${CheckoutBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="relative z-10 w-full max-w-md">
                    <Checkout
                        selectedCoupon={selectedCoupon}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onMemberLoginClick={handleMemberLoginClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePage;