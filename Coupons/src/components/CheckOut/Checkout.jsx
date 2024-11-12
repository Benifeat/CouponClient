// components/CheckOut/Checkout.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCoupons } from '../../context/CouponContext';

const Checkout = ({ selectedCoupon, activeTab, setActiveTab, onMemberLoginClick }) => {
    const { user } = useAuth();
    const { coupons, updateCoupon } = useCoupons();
    const [couponCode, setCouponCode] = useState('');
    const [price, setPrice] = useState(100);
    const [originalPrice] = useState(100);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [appliedCoupons, setAppliedCoupons] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (selectedCoupon && !isSubmitting) {
            const applySelectedCoupon = async () => {
                await handleCouponSubmit(null, selectedCoupon);
            };
            applySelectedCoupon();
        }
    }, [selectedCoupon]);

    useEffect(() => {
        if (!user) {
            setCouponCode('');
            setPrice(originalPrice);
            setError('');
            setSuccess('');
            setAppliedCoupons([]);
        }
    }, [user, originalPrice]);

    const handleCouponSubmit = async (e, codeToSubmit = null) => {
        if (e) e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            const codeToCheck = (codeToSubmit || couponCode).trim().toUpperCase();

            if (!codeToCheck) {
                setError('Please enter a coupon code');
                return;
            }

            // Find the coupon in our context
            const coupon = coupons.find(c => c.code === codeToCheck);
            if (!coupon) {
                throw new Error('Invalid coupon code');
            }

            // Validate coupon
            if (!coupon.isActive) {
                throw new Error('This coupon is not active');
            }

            if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
                throw new Error('This coupon has expired');
            }

            if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
                throw new Error('This coupon has reached its usage limit');
            }

            if (appliedCoupons.some(c => c.code === codeToCheck)) {
                throw new Error('This coupon has already been applied');
            }

            if (!coupon.isStackable && appliedCoupons.length > 0) {
                throw new Error('This coupon cannot be combined with other coupons');
            }

            if (appliedCoupons.length > 0 && !appliedCoupons[0].isStackable) {
                throw new Error('Cannot add more coupons to a non-stackable coupon');
            }

            // Calculate new price
            const currentPrice = price;
            const newPrice = coupon.discountType === 'percentage'
                ? currentPrice * (1 - coupon.discountValue / 100)
                : Math.max(currentPrice - coupon.discountValue, 0);

            // Update coupon usage
            await updateCoupon(coupon.id, {
                ...coupon,
                currentUses: (coupon.currentUses || 0) + 1
            });

            // Update local state
            setAppliedCoupons(prev => [...prev, {
                ...coupon,
                appliedDiscount: currentPrice - newPrice
            }]);
            setPrice(newPrice);
            setCouponCode('');
            setSuccess(`Coupon applied! You saved ₪${(currentPrice - newPrice).toFixed(2)}`);

        } catch (err) {
            setError(err.message || 'Failed to apply coupon');
        } finally {
            setIsSubmitting(false);
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
                {price !== originalPrice && (
                    <div className="text-sm text-green-600 mt-2">
                        Total Savings: ₪{(originalPrice - price).toFixed(2)}
                    </div>
                )}
            </div>

            {/* Applied Coupons */}
            {appliedCoupons.length > 0 && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Applied Coupons:</h3>
                    <div className="space-y-2">
                        {appliedCoupons.map((coupon, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <div>
                                    <span className="font-medium">{coupon.code}</span>
                                    <span className="text-gray-500 ml-2">
                                        ({coupon.discountType === 'percentage'
                                            ? `${coupon.discountValue}%`
                                            : `₪${coupon.discountValue}`})
                                    </span>
                                </div>
                                <span className="text-green-600">
                                    -₪{coupon.appliedDiscount.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Login/Quick Redeem Tabs */}
            {!user && (
                <div className="flex mb-6">
                    <button
                        className={`flex-1 py-2 text-center ${activeTab === 'anonymous'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setActiveTab('anonymous')}
                    >
                        Quick Redeem
                    </button>
                </div>
            )}

            {/* Coupon Form */}
            <form onSubmit={handleCouponSubmit} className="space-y-4">
                {user && (
                    <div className="text-center text-gray-600 mb-4">
                        Logged in as: {user.email}
                    </div>
                )}

                <div>
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter your coupon code"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
                        disabled={isSubmitting}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-orange-400 text-white py-3 rounded-lg font-bold 
                        hover:bg-orange-500 transition-colors
                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Applying...' : 'Apply Coupon'}
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