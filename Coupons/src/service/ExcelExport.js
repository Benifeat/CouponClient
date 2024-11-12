import * as XLSX from "xlsx";
export const exportToExcel = (coupons, filename = "coupons_report.xlsx") => {
  // Transform data for Excel format
  const excelData = coupons.map((coupon) => ({
    ID: coupon.id,
    Code: coupon.code,
    Title: coupon.title,
    Description: coupon.description,
    "Discount Type": coupon.discountType,
    "Discount Value":
      coupon.discountType === "percentage"
        ? `${coupon.discountValue}%`
        : `₪${coupon.discountValue}`,
    "Created Date": new Date(coupon.createdAt).toLocaleDateString(),
    "Expiration Date": coupon.expirationDate
      ? new Date(coupon.expirationDate).toLocaleDateString()
      : "No expiration",
    "Max Uses": coupon.maxUses || "Unlimited",
    "Current Uses": coupon.currentUses || 0,
    Status: coupon.isActive ? "Active" : "Inactive",
    Stackable: coupon.isStackable ? "Yes" : "No",
    "Created By": coupon.createdBy,
  }));

  // Create workbook and worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();

  // Add column widths
  const colWidths = [
    { wch: 5 }, // ID
    { wch: 15 }, // Code
    { wch: 20 }, // Title
    { wch: 30 }, // Description
    { wch: 15 }, // Discount Type
    { wch: 15 }, // Discount Value
    { wch: 15 }, // Created Date
    { wch: 15 }, // Expiration Date
    { wch: 12 }, // Max Uses
    { wch: 12 }, // Current Uses
    { wch: 10 }, // Status
    { wch: 10 }, // Stackable
    { wch: 15 }, // Created By
  ];
  ws["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, "Coupons");

  // Generate Excel file
  XLSX.writeFile(wb, filename);
};
