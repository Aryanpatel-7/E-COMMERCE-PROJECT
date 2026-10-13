
import Product from "../Model/product.js";
import Order from "../Model/order.js";
import User from "../Model/user.js";
import Category from "../Model/category.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalCategories,
      salesResult,
      pendingOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Category.countDocuments(),

      Order.aggregate([
        {
          $match: {
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),

      Order.countDocuments({ status: "Pending" }),
    ]);

    const totalSales = salesResult[0]?.total || 0;

    return res.status(200).json({
      success: true,
      dashboard: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalCategories,
        totalSales,
        pendingOrders,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};
