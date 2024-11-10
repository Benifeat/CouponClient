//home page featuring the slider and the checkout displayes and the nav bar
import { useState, useEffect } from 'react';
import Slider from '../../components/Slider/Slider';
import Checkout from '../../components/CheckOut/Checkout';
import { useNavigate } from 'react-router-dom';

//background image checkout
import CheckoutBg from '../../assets/Confetti.png';

// images sliders
import Coupon10 from '../../assets/coupon10.png';
import Coupon60 from '../../assets/coupon60.png';
import Coupon30 from '../../assets/coupon30.png';
import Coupon15 from '../../assets/coupon15.png';
import BlackFriday from '../../assets/BlackFriday.jpg';
import Shoes from '../../assets/shoeCoupon.jpg';
import Hanuka from '../../assets/hanuka.PNG';
import Christmas from '../../assets/ChristmasAd.png';

const HomePage = ({
    isLoggedIn,
    userEmail,
    toggleLoginForm,
    pendingCouponCode,
    setPendingCouponCode,
    activeTab,
    setActiveTab
}) => {
    const [selectedCoupon, setSelectedCoupon] = useState('');
    // Handle pending coupon code when user logs in
    useEffect(() => {
        if (isLoggedIn && pendingCouponCode) {
            setSelectedCoupon(pendingCouponCode);
            setPendingCouponCode(null);
        }
    }, [isLoggedIn, pendingCouponCode]);

    useEffect(() => {
        if (!isLoggedIn) {
            setSelectedCoupon('');
        }
    }, [isLoggedIn]);

    // Coupon data will be transferred to mock data json
    const dummyCoupons = [
        {
            image: Coupon30,
            title: "BlackFriday",
            code: "TECH30",
            advertisement: {
                title: "BlackFriday Sale!!",
                description: "Get 30% off on all products!",
                backgroundImage: BlackFriday,
                textColor: "text-white"
            }
        },
        {
            image: Coupon10,
            title: "Shoes",
            code: "SHOES10",
            advertisement: {
                backgroundImage: Shoes,
            }
        },
        {
            image: Coupon60,
            title: "Hanuka",
            code: "DONUT60",
            advertisement: {
                backgroundImage: Hanuka,
            }
        },
        {
            image: Coupon15,
            title: "Christmas",
            code: "SANTA15",
            advertisement: {
                title: "Get your Christmas gift now!",
                description: "Get 15% off on all products!",
                backgroundImage: Christmas,
                textColor: "text-white"
            }
        }
    ];

    // Handle login form for coupon from slider
    const handleCouponSelect = (couponCode) => {
        if (isLoggedIn) {
            setSelectedCoupon(couponCode);
        } else {
            toggleLoginForm(couponCode);
        }
    };

    return (
        // Main page with the slider and checkout display
        <div className="flex h-[100vh] bg-gray-100 mt-12">
            <div className="w-[40%] bg-sky-300 p-8">
                {/* slider call */}
                <div className="h-[100%]">
                    <Slider
                        coupons={dummyCoupons}
                        onCouponSelect={handleCouponSelect}
                        isLoggedIn={isLoggedIn}
                    />
                </div>
            </div>
            <div
                className="flex justify-center items-center w-[60%] p-8 relative"
                style={{
                    background: `linear-gradient(rgba(251, 191, 36, 0.8), rgba(251, 191, 36, 0.8)), url(${CheckoutBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* checkout call */}
                <div className="relative z-10">
                    <Checkout
                        isLoggedIn={isLoggedIn}
                        userEmail={userEmail}
                        selectedCoupon={selectedCoupon}
                        toggleLoginForm={toggleLoginForm}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePage;