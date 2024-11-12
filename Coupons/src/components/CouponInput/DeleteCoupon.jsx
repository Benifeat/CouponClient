// components/AdminDashBoard/DeleteCoupon.jsx
import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { api } from '../../auth/api';

const DeleteCoupon = ({ coupon, onClose, onCouponDeleted }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await api.coupons.delete(coupon.id);
            onCouponDeleted?.(coupon.id);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to delete coupon');
            setIsDeleting(false);
        }
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

                <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Delete Coupon</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Are you sure you want to delete the coupon "{coupon.code}"? This action cannot be undone.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Coupon Details</h4>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <dt className="text-gray-500">Code:</dt>
                        <dd className="text-gray-900 font-medium">{coupon.code}</dd>
                        <dt className="text-gray-500">Discount:</dt>
                        <dd className="text-gray-900 font-medium">
                            {coupon.discountType === 'percentage'
                                ? `${coupon.discountValue}%`
                                : `₪${coupon.discountValue}`}
                        </dd>
                        <dt className="text-gray-500">Uses:</dt>
                        <dd className="text-gray-900 font-medium">
                            {coupon.currentUses || 0}
                            {coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                        </dd>
                        <dt className="text-gray-500">Created:</dt>
                        <dd className="text-gray-900 font-medium">
                            {new Date(coupon.createdAt).toLocaleDateString()}
                        </dd>
                    </dl>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700
              ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Coupon'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCoupon;