import mockData from "../Data/MockData.json";
import { userApi } from "../service/userApi";
// In-memory storage
let coupons = mockData.coupons.map((coupon) => ({
  ...coupon,
  currentUses: coupon.currentUses || 0,
  isActive: coupon.isActive !== undefined ? coupon.isActive : true,
  isStackable: coupon.isStackable !== undefined ? coupon.isStackable : false,
}));

let recentActivity = mockData.recentActivity || [];

// Simulated delay to mimic API calls
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to log activities
const logActivity = (couponCode, action, details) => {
  const activity = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    couponCode,
    action,
    details,
  };
  recentActivity = [activity, ...recentActivity].slice(0, 50);
  return activity;
};

export const api = {
  // User endpoints
  users: userApi,
  // Coupons endpoints
  coupons: {
    // Get all coupons with filtering and sorting
    getAll: async (filters = {}) => {
      await delay(300);
      let filtered = [...coupons];

      // Apply filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (coupon) =>
            coupon.code.toLowerCase().includes(searchLower) ||
            (coupon.description &&
              coupon.description.toLowerCase().includes(searchLower)) ||
            (coupon.title && coupon.title.toLowerCase().includes(searchLower))
        );
      }

      if (filters.isActive !== undefined) {
        filtered = filtered.filter(
          (coupon) => coupon.isActive === filters.isActive
        );
      }

      if (filters.isStackable !== undefined) {
        filtered = filtered.filter(
          (coupon) => coupon.isStackable === filters.isStackable
        );
      }

      if (filters.expirationStatus) {
        const now = new Date();
        switch (filters.expirationStatus) {
          case "active":
            filtered = filtered.filter(
              (coupon) =>
                !coupon.expirationDate || new Date(coupon.expirationDate) > now
            );
            break;
          case "expired":
            filtered = filtered.filter(
              (coupon) =>
                coupon.expirationDate && new Date(coupon.expirationDate) <= now
            );
            break;
        }
      }

      // Sort
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          switch (filters.sortBy) {
            case "code":
              return a.code.localeCompare(b.code);
            case "uses":
              return b.currentUses - a.currentUses;
            case "expiration":
              if (!a.expirationDate) return 1;
              if (!b.expirationDate) return -1;
              return new Date(a.expirationDate) - new Date(b.expirationDate);
            case "created":
              return new Date(b.createdAt) - new Date(a.createdAt);
            case "value":
              const aValue =
                a.discountType === "percentage"
                  ? a.discountValue / 100
                  : a.discountValue;
              const bValue =
                b.discountType === "percentage"
                  ? b.discountValue / 100
                  : b.discountValue;
              return bValue - aValue;
            default:
              return 0;
          }
        });
      }

      return filtered;
    },

    // Get single coupon by ID
    getById: async (id) => {
      await delay(300);
      const coupon = coupons.find((c) => c.id === id);
      if (!coupon) throw new Error("Coupon not found");
      return coupon;
    },

    // Validate a coupon code
    validate: async (code) => {
      await delay(300);
      const coupon = coupons.find(
        (c) => c.code.toLowerCase() === code.toLowerCase()
      );

      if (!coupon) {
        throw new Error("Invalid coupon code");
      }

      // Validate expiration
      if (
        coupon.expirationDate &&
        new Date(coupon.expirationDate) < new Date()
      ) {
        throw new Error("This coupon has expired");
      }

      // Validate if active
      if (!coupon.isActive) {
        throw new Error("This coupon is not currently active");
      }

      // Validate usage limit
      if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
        throw new Error("This coupon has reached its usage limit");
      }

      return coupon;
    },

    // Create new coupon
    create: async (couponData) => {
      await delay(500);

      // Validate required fields
      if (
        !couponData.code ||
        !couponData.discountType ||
        !couponData.discountValue
      ) {
        throw new Error("Missing required fields");
      }

      // Validate code uniqueness
      if (
        coupons.some(
          (c) => c.code.toLowerCase() === couponData.code.toLowerCase()
        )
      ) {
        throw new Error("Coupon code already exists");
      }

      // Validate discount value
      if (
        couponData.discountType === "percentage" &&
        (couponData.discountValue < 0 || couponData.discountValue > 100)
      ) {
        throw new Error("Percentage discount must be between 0 and 100");
      }

      const newCoupon = {
        id: Math.max(0, ...coupons.map((c) => c.id)) + 1,
        ...couponData,
        code: couponData.code.toUpperCase(),
        createdAt: new Date().toISOString(),
        currentUses: 0,
        isActive: true,
        createdBy: 1, // Mock user ID
      };

      coupons = [...coupons, newCoupon];
      logActivity(newCoupon.code, "Created", "New coupon added");

      return newCoupon;
    },

    // Update existing coupon
    update: async (id, couponData) => {
      await delay(500);
      const index = coupons.findIndex((c) => c.id === id);

      if (index === -1) throw new Error("Coupon not found");

      // Check code uniqueness if code is being changed
      if (
        couponData.code &&
        couponData.code !== coupons[index].code &&
        coupons.some(
          (c) => c.code.toLowerCase() === couponData.code.toLowerCase()
        )
      ) {
        throw new Error("Coupon code already exists");
      }

      // Validate percentage discount if being updated
      if (
        couponData.discountType === "percentage" &&
        couponData.discountValue &&
        (couponData.discountValue < 0 || couponData.discountValue > 100)
      ) {
        throw new Error("Percentage discount must be between 0 and 100");
      }

      const updatedCoupon = {
        ...coupons[index],
        ...couponData,
        id, // Ensure ID doesn't change
        lastModified: new Date().toISOString(),
      };

      coupons = [
        ...coupons.slice(0, index),
        updatedCoupon,
        ...coupons.slice(index + 1),
      ];

      // Log appropriate activity
      if (
        couponData.currentUses !== undefined &&
        couponData.currentUses > coupons[index].currentUses
      ) {
        logActivity(
          updatedCoupon.code,
          "Used",
          `Coupon used. Remaining uses: ${
            updatedCoupon.maxUses
              ? updatedCoupon.maxUses - updatedCoupon.currentUses
              : "unlimited"
          }`
        );
      } else {
        logActivity(updatedCoupon.code, "Modified", "Coupon details updated");
      }

      return updatedCoupon;
    },

    // Delete coupon
    delete: async (id) => {
      await delay(500);
      const index = coupons.findIndex((c) => c.id === id);

      if (index === -1) throw new Error("Coupon not found");

      const deletedCoupon = coupons[index];
      coupons = coupons.filter((c) => c.id !== id);

      logActivity(deletedCoupon.code, "Deleted", "Coupon removed");

      return true;
    },
  },

  // Reports endpoints
  reports: {
    // Get coupon statistics
    getCouponStats: async (timeRange = "all") => {
      await delay(300);

      const now = new Date();
      let filteredCoupons = [...coupons];

      // Apply time range filter
      if (timeRange !== "all") {
        const timeRanges = {
          week: 7,
          month: 30,
          year: 365,
        };
        const daysBack = timeRanges[timeRange];
        const cutoffDate = new Date(now.setDate(now.getDate() - daysBack));

        filteredCoupons = filteredCoupons.filter(
          (coupon) => new Date(coupon.createdAt) >= cutoffDate
        );
      }

      const activeCoupons = filteredCoupons.filter((c) => c.isActive);
      const totalUses = filteredCoupons.reduce(
        (sum, c) => sum + (c.currentUses || 0),
        0
      );

      const expiringThisMonth = filteredCoupons.filter((coupon) => {
        if (!coupon.expirationDate) return false;
        const expDate = new Date(coupon.expirationDate);
        return (
          expDate.getMonth() === now.getMonth() &&
          expDate.getFullYear() === now.getFullYear()
        );
      });

      return {
        summary: {
          totalCoupons: filteredCoupons.length,
          activeCoupons: activeCoupons.length,
          totalUses,
          averageUsePerCoupon: totalUses / filteredCoupons.length || 0,
          stackableCoupons: filteredCoupons.filter((c) => c.isStackable).length,
          expiringThisMonth: expiringThisMonth.length,
        },
        coupons: filteredCoupons.map((coupon) => ({
          id: coupon.id,
          code: coupon.code,
          title: coupon.title,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          currentUses: coupon.currentUses,
          maxUses: coupon.maxUses,
          createdAt: coupon.createdAt,
          expirationDate: coupon.expirationDate,
          isActive: coupon.isActive,
          isStackable: coupon.isStackable,
          lastModified: coupon.lastModified,
        })),
        recentActivity: recentActivity.slice(0, 20), // Last 20 activities
        usageByType: {
          percentage: filteredCoupons.filter(
            (c) => c.discountType === "percentage"
          ).length,
          fixed: filteredCoupons.filter((c) => c.discountType === "fixed")
            .length,
        },
      };
    },

    // Log activity
    logActivity: async (activityData) => {
      await delay(300);
      return logActivity(
        activityData.couponCode,
        activityData.action,
        activityData.details
      );
    },

    // Export data (returns formatted data for Excel export)
    exportData: async () => {
      await delay(300);
      return {
        coupons: coupons.map((coupon) => ({
          Code: coupon.code,
          Title: coupon.title || "",
          Description: coupon.description || "",
          "Discount Type": coupon.discountType,
          "Discount Value": `${coupon.discountValue}${
            coupon.discountType === "percentage" ? "%" : "₪"
          }`,
          "Current Uses": coupon.currentUses || 0,
          "Max Uses": coupon.maxUses || "Unlimited",
          "Created Date": new Date(coupon.createdAt).toLocaleDateString(),
          "Expiration Date": coupon.expirationDate
            ? new Date(coupon.expirationDate).toLocaleDateString()
            : "No expiration",
          Status: coupon.isActive ? "Active" : "Inactive",
          Stackable: coupon.isStackable ? "Yes" : "No",
          "Last Modified": coupon.lastModified
            ? new Date(coupon.lastModified).toLocaleString()
            : "N/A",
        })),
        activity: recentActivity.map((activity) => ({
          "Date & Time": new Date(activity.timestamp).toLocaleString(),
          "Coupon Code": activity.couponCode,
          Action: activity.action,
          Details: activity.details,
        })),
      };
    },
  },
};

export default api;
