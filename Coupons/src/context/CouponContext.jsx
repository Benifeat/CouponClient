import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../auth/api";
import { useAuth } from "./AuthContext";

const CouponContext = createContext(null);

export const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  const fetchCoupons = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.coupons.getAll(filters);
      setCoupons(data);
    } catch (err) {
      setError("Failed to fetch coupons");
      console.error("Error fetching coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.reports.getCouponStats();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchStats();
  }, []);

  const addCoupon = async (couponData) => {
    try {
      const newCoupon = await api.coupons.create({
        ...couponData,
        createdBy: user?.id || 1,
      });
      // Update local state immediately
      setCoupons(prev => [...prev, newCoupon]);
      await fetchStats(); // Refresh stats
      return newCoupon;
    } catch (err) {
      throw new Error(err.message || "Failed to create coupon");
    }
  };

  const updateCoupon = async (id, couponData) => {
    try {
      const updatedCoupon = await api.coupons.update(id, couponData);
      // Update local state immediately
      setCoupons(prev =>
        prev.map((coupon) => (coupon.id === id ? updatedCoupon : coupon))
      );
      await fetchStats(); // Refresh stats
      return updatedCoupon;
    } catch (err) {
      throw new Error(err.message || "Failed to update coupon");
    }
  };

  const deleteCoupon = async (id) => {
    try {
      await api.coupons.delete(id);
      // Update local state immediately
      setCoupons(prev => prev.filter((coupon) => coupon.id !== id));
      await fetchStats(); // Refresh stats
    } catch (err) {
      throw new Error(err.message || "Failed to delete coupon");
    }
  };

  const refreshData = async () => {
    await fetchCoupons();
    await fetchStats();
  };

  return (
    <CouponContext.Provider
      value={{
        coupons,
        loading,
        error,
        stats,
        fetchCoupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        refreshData,
        refreshStats: fetchStats,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupons = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error("useCoupons must be used within a CouponProvider");
  }
  return context;
};