/*
right side of the homepage incharge of the coupon use and some aspects of the login system  
*/
import { useState, useEffect } from 'react';

const Checkout = ({
    isLoggedIn,
    userEmail,
    selectedCoupon,
    toggleLoginForm,
    activeTab,
    setActiveTab
}) => {
    const [couponCode, setCouponCode] = useState('');
    const [price, setPrice] = useState(100);
    const [originalPrice] = useState(100);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle selected coupon from slider
    useEffect(() => {
        if (selectedCoupon) {
            setCouponCode(selectedCoupon);
            handleCouponSubmit(null, selectedCoupon);
        }
    }, [selectedCoupon]);

    // zero triggered events in after logout
    useEffect(() => {
        if (!isLoggedIn) {
            setCouponCode('');
            setPrice(originalPrice);
            setError('');
            setSuccess('');
        }
    }, [isLoggedIn, originalPrice]);

    // Handle coupon code submission
    const handleCouponSubmit = async (e, codeToSubmit = null) => {
        if (e) e.preventDefault();
        setError('');
        setSuccess('');

        const codeToCheck = codeToSubmit || couponCode;

        if (!codeToCheck.trim()) {
            setError('Please enter a coupon code');
            return;
        }

        try {
            const normalizedCode = codeToCheck.trim().toUpperCase();
            if (['TECH30', 'SHOES10', 'DONUT60', 'SANTA15'].includes(normalizedCode)) {
                const discount = parseInt(normalizedCode.match(/\d+/)[0]);
                const discountedPrice = originalPrice * (1 - discount / 100);
                setPrice(discountedPrice);
                setSuccess(`Coupon applied! You saved ${discount}%`);
                setCouponCode(normalizedCode);
            } else {
                setError('Invalid coupon code');
                setCouponCode(codeToCheck);
            }
        } catch (err) {
            setError('Error applying coupon');
        }
    };

    // Handle (quick redeem - member login)
    const handleTabChange = (tab) => {
        if (setActiveTab) {
            setActiveTab(tab);
        }
        if (tab === 'login') {
            toggleLoginForm();
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            {/* Price Display */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-4">Apply Coupon</h2>
                <div className="flex justify-center items-center gap-4">
                    {price !== originalPrice && (
                        <span className="text-2xl text-gray-400 line-through">
                            ₪{originalPrice.toFixed(2)}
                        </span>
                    )}
                    <span className="text-4xl font-bold text-blue-600">
                        ₪{price.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* cases of quick redeem - member login */}
            {!isLoggedIn && (
                <div className="flex mb-6">
                    <button
                        className={`flex-1 py-2 text-center ${activeTab === 'anonymous'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                            } transition-colors rounded-l-lg`}
                        onClick={() => handleTabChange('anonymous')}
                    >
                        Quick Redeem
                    </button>
                    <button
                        className={`flex-1 py-2 text-center ${activeTab === 'login'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                            } transition-colors rounded-r-lg`}
                        onClick={() => handleTabChange('login')}
                    >
                        Member Login
                    </button>
                </div>
            )}

            {/* Coupon Form */}
            <form onSubmit={handleCouponSubmit} className="space-y-4">
                {isLoggedIn && (
                    <div className="text-center text-gray-600 mb-4">
                        Logged in as: {userEmail}
                    </div>
                )}

                <div>
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter your coupon code"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-orange-400 text-white py-3 rounded-lg font-bold hover:bg-orange-500 transition-colors"
                >
                    Apply Coupon
                </button>

                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="text-green-500 text-sm text-center">
                        {success}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Checkout;