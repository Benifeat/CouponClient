import { useState, useEffect } from 'react';
import { X, AlertCircle, Save } from 'lucide-react';
import { useCoupons } from '../../context/CouponContext';

const EditCoupon = ({ coupon, onClose, onCouponUpdated }) => {
    const { updateCoupon } = useCoupons(); // Get updateCoupon from context
    const [formData, setFormData] = useState({
        code: '',
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        expirationDate: '',
        maxUses: '',
        isStackable: false,
        isActive: true
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Set initial form data when coupon prop changes
    useEffect(() => {
        if (coupon) {
            setFormData({
                code: coupon.code || '',
                title: coupon.title || '',
                description: coupon.description || '',
                discountType: coupon.discountType || 'percentage',
                discountValue: coupon.discountValue || '',
                expirationDate: coupon.expirationDate ? coupon.expirationDate.split('T')[0] : '',
                maxUses: coupon.maxUses || '',
                isStackable: Boolean(coupon.isStackable),
                isActive: coupon.isActive !== undefined ? coupon.isActive : true
            });
        }
    }, [coupon]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!coupon?.id) {
            setError('Invalid coupon ID');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            const updatedCoupon = await updateCoupon(coupon.id, {
                ...formData,
                discountValue: Number(formData.discountValue),
                maxUses: formData.maxUses ? Number(formData.maxUses) : null
            });

            onCouponUpdated?.(updatedCoupon);
        } catch (err) {
            console.error('Error updating coupon:', err);
            setError(err.message || 'Failed to update coupon');
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6">Edit Coupon</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Coupon Code*
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., SUMMER2024"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title*
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Summer Sale"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            placeholder="Describe the coupon and its terms..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Discount Type*
                            </label>
                            <select
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Discount Value*
                            </label>
                            <input
                                type="number"
                                name="discountValue"
                                value={formData.discountValue}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder={formData.discountType === 'percentage' ? '0-100' : '0'}
                                min="0"
                                max={formData.discountType === 'percentage' ? "100" : undefined}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiration Date
                            </label>
                            <input
                                type="date"
                                name="expirationDate"
                                value={formData.expirationDate}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Uses
                            </label>
                            <input
                                type="number"
                                name="maxUses"
                                value={formData.maxUses}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="Unlimited if empty"
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isStackable"
                                name="isStackable"
                                checked={formData.isStackable}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isStackable" className="ml-2 block text-sm text-gray-900">
                                Allow stacking
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                Active
                            </label>
                        </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Usage Statistics</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Created: </span>
                                <span className="font-medium">
                                    {new Date(coupon.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Times Used: </span>
                                <span className="font-medium">{coupon.currentUses || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                flex items-center gap-2
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Save size={20} />
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCoupon;