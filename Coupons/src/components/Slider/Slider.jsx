/*left side of homepage the slider of advertisments and coupons
a bit of creativity wont harm anyone unless you are the developer working on it in 2 am
*/
// components/Slider/Slider.jsx
import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

// Import all images
import Coupon10 from '../../assets/coupon10.png';
import Coupon60 from '../../assets/coupon60.png';
import Coupon30 from '../../assets/coupon30.png';
import Coupon15 from '../../assets/coupon15.png';
import BlackFriday from '../../assets/BlackFriday.jpg';
import Shoes from '../../assets/shoeCoupon.jpg';
import Hanuka from '../../assets/hanuka.PNG';
import Christmas from '../../assets/ChristmasAd.png';

// Image mapping
const IMAGE_MAP = {
    'coupon10.png': Coupon10,
    'coupon60.png': Coupon60,
    'coupon30.png': Coupon30,
    'coupon15.png': Coupon15,
    'BlackFriday.jpg': BlackFriday,
    'shoeCoupon.jpg': Shoes,
    'hanuka.PNG': Hanuka,
    'ChristmasAd.png': Christmas
};

const Slider = ({ coupons, onCouponSelect, isLoggedIn }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === coupons.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? coupons.length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleCouponClick = (coupon) => {
        if (onCouponSelect) {
            onCouponSelect(coupon.code);
        }
    };

    const getImage = (imagePath) => {
        return IMAGE_MAP[imagePath] || '';
    };

    return (
        <div className="relative h-full w-full flex flex-col z-0">
            <div className="flex-1 relative overflow-hidden rounded-lg mb-4">
                <div
                    className="transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateY(-${currentIndex * 100}%)` }}
                >
                    {coupons.map((coupon, index) => (
                        <div
                            key={index}
                            className="absolute w-full h-full flex items-center justify-center"
                            style={{ top: `${index * 100}%` }}
                        >
                            <div className="w-full h-full flex flex-col items-center">
                                <div
                                    className="flex-1 w-full flex flex-col items-center rounded-lg relative overflow-hidden"
                                    style={{
                                        backgroundImage: `url(${getImage(coupon.advertisement.backgroundImage)})`,
                                        backgroundSize: '100% 100%',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black/30"></div>

                                    <div className="relative z-10 flex flex-col justify-between h-full w-full">
                                        <div className="p-6 text-center">
                                            <h2 className={`text-4xl font-bold mt-8 ${coupon.advertisement.textColor || 'text-white'}`}>
                                                {coupon.advertisement.title}
                                            </h2>
                                            <p className={`text-xl text-center ${coupon.advertisement.textColor || 'text-white'}`}>
                                                {coupon.advertisement.description}
                                            </p>
                                        </div>

                                        <div className="w-full flex justify-center p-6">
                                            <div
                                                onClick={() => handleCouponClick(coupon)}
                                                className="w-[50%] cursor-pointer transform hover:scale-105 transition-transform relative"
                                            >
                                                <div className="bg-white/0 rounded-lg shadow-xl">
                                                    <img
                                                        src={getImage(coupon.image)}
                                                        alt={`${coupon.title} - ${coupon.code}`}
                                                        className="w-full object-contain max-h-[200px]"
                                                    />
                                                </div>
                                                {!isLoggedIn && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                                                        <span className="text-white font-medium">Login to apply coupon</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={prevSlide}
                className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
            >
                <ChevronUp className="w-6 h-6" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
            >
                <ChevronDown className="w-6 h-6" />
            </button>
        </div>
    );
};

export default Slider;