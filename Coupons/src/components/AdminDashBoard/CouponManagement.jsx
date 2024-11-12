// components/AdminDashboard/CouponManagement/CouponManagement.jsx
import { useState } from 'react';
import { Grid, List, Search, Plus, Download } from 'lucide-react';
import { useCoupons } from '../../context/CouponContext';
import { useAuth } from '../../context/AuthContext';
import AddCoupon from '../CouponInput/AddCoupon';
import EditCoupon from '../CouponInput/EditCoupon';
import DeleteCoupon from '../CouponInput/DeleteCoupon';
import { exportToExcel } from '../../service/excelExport';

const CouponManagement = () => {
    const { user } = useAuth();
    const { coupons, loading, error, refreshData } = useCoupons();
    const [viewMode, setViewMode] = useState('grid');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        sortBy: 'created',
        isActive: undefined
    });

    // Filter coupons based on current filters
    const filteredCoupons = coupons.filter(coupon => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
                coupon.code.toLowerCase().includes(searchLower) ||
                coupon.title.toLowerCase().includes(searchLower) ||
                (coupon.description && coupon.description.toLowerCase().includes(searchLower));

            if (!matchesSearch) return false;
        }

        if (filters.isActive !== undefined) {
            if (coupon.isActive !== filters.isActive) return false;
        }

        return true;
    }).sort((a, b) => {
        switch (filters.sortBy) {
            case 'code':
                return a.code.localeCompare(b.code);
            case 'uses':
                return (b.currentUses || 0) - (a.currentUses || 0);
            case 'expiration':
                if (!a.expirationDate) return 1;
                if (!b.expirationDate) return -1;
                return new Date(a.expirationDate) - new Date(b.expirationDate);
            case 'created':
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    const handleExport = () => {
        try {
            exportToExcel(filteredCoupons, 'coupons_export.xlsx');
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const handleEdit = (coupon) => {
        setSelectedCoupon(coupon);
        setShowEditModal(true);
    };

    const handleDelete = (coupon) => {
        setSelectedCoupon(coupon);
        setShowDeleteModal(true);
    };

    const handleModalClose = async () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedCoupon(null);
        await refreshData(); // Refresh data when modal closes
    };

    const handleCouponAdded = async () => {
        await refreshData();
        handleModalClose();
    };

    const handleCouponUpdated = async () => {
        await refreshData();
        handleModalClose();
    };

    const handleCouponDeleted = async () => {
        await refreshData();
        handleModalClose();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-1 w-full sm:w-auto items-center gap-4">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search coupons..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="created">Sort by Created</option>
                        <option value="code">Sort by Code</option>
                        <option value="uses">Sort by Uses</option>
                        <option value="expiration">Sort by Expiration</option>
                    </select>
                    <button
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
                    >
                        {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
                    </button>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        <Plus size={20} />
                        Add Coupon
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                        <Download size={20} />
                        Export
                    </button>
                </div>
            </div>

            {/* Coupons Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCoupons.map((coupon) => (
                        <CouponCard
                            key={coupon.id}
                            coupon={coupon}
                            onEdit={() => handleEdit(coupon)}
                            onDelete={() => handleDelete(coupon)}
                        />
                    ))}
                </div>
            ) : (
                <CouponTable
                    coupons={filteredCoupons}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* Modals */}
            {showAddModal && (
                <AddCoupon
                    onClose={handleModalClose}
                    onCouponAdded={handleCouponAdded}
                />
            )}
            {showEditModal && selectedCoupon && (
                <EditCoupon
                    coupon={selectedCoupon}
                    onClose={handleModalClose}
                    onCouponUpdated={handleCouponUpdated}
                />
            )}
            {showDeleteModal && selectedCoupon && (
                <DeleteCoupon
                    coupon={selectedCoupon}
                    onClose={handleModalClose}
                    onCouponDeleted={handleCouponDeleted}
                />
            )}
        </div>
    );
};
// Coupon Card Component for Grid View
const CouponCard = ({ coupon, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{coupon.code}</h3>
                <p className="text-sm text-gray-500">{coupon.title}</p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onEdit}
                    className="text-blue-600 hover:text-blue-800"
                >
                    <span className="sr-only">Edit</span>
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-800"
                >
                    <span className="sr-only">Delete</span>
                    Delete
                </button>
            </div>
        </div>
        <div className="space-y-2">
            <p className="text-sm">
                <span className="font-medium">Discount: </span>
                {coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}%`
                    : `₪${coupon.discountValue}`}
            </p>
            <p className="text-sm">
                <span className="font-medium">Uses: </span>
                {coupon.currentUses || 0}
                {coupon.maxUses ? ` / ${coupon.maxUses}` : ' (Unlimited)'}
            </p>
            <p className="text-sm">
                <span className="font-medium">Expires: </span>
                {coupon.expirationDate
                    ? new Date(coupon.expirationDate).toLocaleDateString()
                    : 'No expiration'}
            </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
            <span className={`px-2 py-1 text-xs rounded-full font-medium
                ${coupon.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'}`}
            >
                {coupon.isActive ? 'Active' : 'Inactive'}
            </span>
            {coupon.isStackable && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Stackable
                </span>
            )}
        </div>
    </div>
);

// Coupon Table Component for List View
const CouponTable = ({ coupons, onEdit, onDelete }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expiration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                            <div className="text-sm text-gray-500">{coupon.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                                {coupon.discountType === 'percentage'
                                    ? `${coupon.discountValue}%`
                                    : `₪${coupon.discountValue}`}
                            </div>
                            {coupon.isStackable && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    Stackable
                                </span>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {coupon.currentUses || 0}
                            {coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {coupon.expirationDate
                                ? new Date(coupon.expirationDate).toLocaleDateString()
                                : 'No expiration'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                ${coupon.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'}`}
                            >
                                {coupon.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                onClick={() => onEdit(coupon)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(coupon)}
                                className="text-red-600 hover:text-red-900"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default CouponManagement;