// components/AdminDashboard/UserManagement/DeleteUser.jsx
import { useState } from 'react';
import { X, AlertTriangle, AlertCircle } from 'lucide-react';
import { useUsers } from '../../../context/UserContext';

const DeleteUser = ({ user, onClose, onUserDeleted }) => {
    const { deleteUser } = useUsers();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setIsDeleting(true);
        setError('');

        try {
            await deleteUser(user.id);
            onUserDeleted?.(user.id);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to delete user');
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete the user "{user.email}"? This action cannot be undone.
                    </p>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">User Details</h4>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <dt className="text-gray-500">Name:</dt>
                        <dd className="text-gray-900 font-medium">{user.name}</dd>
                        <dt className="text-gray-500">Email:</dt>
                        <dd className="text-gray-900 font-medium">{user.email}</dd>
                        <dt className="text-gray-500">Role:</dt>
                        <dd className="text-gray-900 font-medium">{user.role}</dd>
                        <dt className="text-gray-500">Coupons Created:</dt>
                        <dd className="text-gray-900 font-medium">{user.couponsCreated || 0}</dd>
                    </dl>
                </div>

                <div className="flex justify-end gap-3 mt-6">
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
                        {isDeleting ? 'Deleting...' : 'Delete User'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUser;