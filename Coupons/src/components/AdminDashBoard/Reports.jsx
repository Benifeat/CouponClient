// components/AdminDashboard/Reports/Reports.jsx
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar, ResponsiveContainer
} from 'recharts';
import { useCoupons } from '../../context/CouponContext';
import { exportToExcel } from '../../service/ExcelExport';

const Reports = () => {
    const { stats, loading, error, refreshStats } = useCoupons();
    const [dateRange, setDateRange] = useState('month');

    useEffect(() => {
        refreshStats();
    }, [dateRange]);

    const handleExport = async () => {
        try {
            if (stats) {
                const exportData = {
                    coupons: stats.coupons.map(coupon => ({
                        Code: coupon.code,
                        Title: coupon.title,
                        'Discount Type': coupon.discountType,
                        'Discount Value': coupon.discountValue,
                        'Current Uses': coupon.currentUses,
                        'Max Uses': coupon.maxUses || 'Unlimited',
                        'Created At': new Date(coupon.createdAt).toLocaleDateString(),
                        'Expiration Date': coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : 'No expiration',
                        'Is Active': coupon.isActive ? 'Yes' : 'No',
                        'Is Stackable': coupon.isStackable ? 'Yes' : 'No'
                    })),
                    activity: stats.recentActivity.map(activity => ({
                        Date: new Date(activity.timestamp).toLocaleDateString(),
                        Time: new Date(activity.timestamp).toLocaleTimeString(),
                        'Coupon Code': activity.couponCode,
                        Action: activity.action,
                        Details: activity.details
                    }))
                };

                // Export to Excel with multiple sheets
                exportToExcel(exportData.coupons, 'coupon_reports.xlsx');
            }
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-6 text-center text-gray-500">
                No data available
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header Controls */}
            <div className="flex justify-between items-center mb-6">
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                </select>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    <Download size={20} />
                    Export to Excel
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Coupons"
                    value={stats.summary.totalCoupons}
                />
                <StatCard
                    title="Active Coupons"
                    value={stats.summary.activeCoupons}
                    color="text-green-600"
                />
                <StatCard
                    title="Total Uses"
                    value={stats.summary.totalUses}
                    color="text-blue-600"
                />
                <StatCard
                    title="Avg Uses/Coupon"
                    value={stats.summary.averageUsePerCoupon.toFixed(1)}
                    color="text-purple-600"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Usage Chart */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Coupon Usage by Type</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[stats.usageByType]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="percentage" fill="#8884d8" name="Percentage" />
                                <Bar dataKey="fixed" fill="#82ca9d" name="Fixed Amount" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Performing Coupons */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Top Performing Coupons</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.coupons.slice(0, 5)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="code" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="currentUses" fill="#8884d8" name="Uses" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow mt-6">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coupon</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stats.recentActivity.map((activity, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(activity.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {activity.couponCode}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {activity.action}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {activity.details}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color = "text-gray-900" }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
);

export default Reports;