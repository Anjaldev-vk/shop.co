import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// 2. Register the components you will use
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// --- Reusable UI Components ---
const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-blue-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);
const ProductsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);
const SalesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-yellow-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 12v4m0 4v.01M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
    />
  </svg>
);
const RevenueIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-indigo-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className="bg-gray-100 p-4 rounded-full">{icon}</div>
  </div>
);

// --- Reusable Chart Card Component ---
const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
    <div className="h-64">{children}</div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    sales: 0,
    revenue: "0",
  });
  const [loading, setLoading] = useState(true);

  // Add state to hold the data for our charts
  const [chartData, setChartData] = useState({
    revenueByProduct: null,
    topSellingProducts: null,
    orderStatusDist: null,
    revenueByCategory: null,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          api.get("/users"),
          api.get("/products"),
          api.get("/orders"),
        ]);

        const users = usersRes.data;
        const products = productsRes.data;
        const orders = ordersRes.data;

        // --- Calculate Stats ---
        const totalRevenue = orders.reduce(
          (sum, order) =>
            sum + (order.status !== "Cancelled" ? order.total : 0),
          0
        );

        setStats({
          users: users.length,
          products: products.length,
          sales: orders.length,
          revenue: totalRevenue.toLocaleString("en-IN"),
        });

        // --- Process data for charts ---
        processChartData(orders, products);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    const processChartData = (orders, products) => {
      const validOrders = orders.filter((o) => o.status !== "Cancelled");

      const productCategoryMap = products.reduce((acc, p) => {
        acc[p.name] = p.category;
        return acc;
      }, {});

      const revenueByProduct = {};
      const topSellingProducts = {};
      const orderStatusDist = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});
      const revenueByCategory = {};

      validOrders.forEach((order) => {
        order.items.forEach((item) => {
          const revenue = item.price * item.quantity;
          revenueByProduct[item.name] =
            (revenueByProduct[item.name] || 0) + revenue;
          topSellingProducts[item.name] =
            (topSellingProducts[item.name] || 0) + item.quantity;
          const category = productCategoryMap[item.name] || "Other";
          revenueByCategory[category] =
            (revenueByCategory[category] || 0) + revenue;
        });
      });

      // Prepare data for Chart.js
      const sortedRevenue = Object.entries(revenueByProduct)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      const sortedQuantity = Object.entries(topSellingProducts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      const sortedCategories = Object.entries(revenueByCategory).sort(
        (a, b) => b[1] - a[1]
      );

      const statusColors = {
        Pending: "#F59E0B",
        Shipped: "#3B82F6",
        Delivered: "#22C55E",
        Cancelled: "#EF4444",
        Default: "#6B7281",
      };

      const statusLabels = Object.keys(orderStatusDist);
      const statusBackgroundColors = statusLabels.map(
        (label) => statusColors[label] || statusColors.Default
      );

      setChartData({
        revenueByProduct: {
          labels: sortedRevenue.map((item) => item[0]),
          datasets: [
            {
              label: "Revenue (₹)",
              data: sortedRevenue.map((item) => item[1]),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        },
        topSellingProducts: {
          labels: sortedQuantity.map((item) => item[0]),
          datasets: [
            {
              label: "Quantity Sold",
              data: sortedQuantity.map((item) => item[1]),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
          ],
        },
        orderStatusDist: {
          labels: statusLabels,
          datasets: [
            {
              data: Object.values(orderStatusDist),
              backgroundColor: statusBackgroundColors,
            },
          ],
        },
        revenueByCategory: {
          labels: sortedCategories.map((cat) => cat[0]),
          datasets: [
            {
              label: "Revenue (₹)",
              data: sortedCategories.map((cat) => cat[1]),
              backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
          ],
        },
      });
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Admin Dashboard{" "}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={<UsersIcon />}
        />
        <StatCard
          title="Total Products"
          value={stats.products}
          icon={<ProductsIcon />}
        />
        <StatCard
          title="Total Sales"
          value={stats.sales}
          icon={<SalesIcon />}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.revenue}`}
          icon={<RevenueIcon />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {chartData.revenueByProduct && (
          <ChartCard title="Top 5 Products by Revenue">
            <Bar
              options={{ responsive: true, maintainAspectRatio: false }}
              data={chartData.revenueByProduct}
            />
          </ChartCard>
        )}
        {chartData.topSellingProducts && (
          <ChartCard title="Top 5 Products by Quantity Sold">
            <Bar
              options={{ responsive: true, maintainAspectRatio: false }}
              data={chartData.topSellingProducts}
            />
          </ChartCard>
        )}
        {chartData.revenueByCategory && (
          <ChartCard title="Revenue by Category">
            <Bar
              options={{ responsive: true, maintainAspectRatio: false }}
              data={chartData.revenueByCategory}
            />
          </ChartCard>
        )}
        {chartData.orderStatusDist && (
          <ChartCard title="Order Status Distribution">
            <Pie
              options={{ responsive: true, maintainAspectRatio: false }}
              data={chartData.orderStatusDist}
            />
          </ChartCard>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
