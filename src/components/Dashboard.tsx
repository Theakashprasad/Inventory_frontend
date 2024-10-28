import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";

const Dashboard = () => {
  const [inventoryCount, setInventoryCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalStockQuantity, setTotalStockQuantity] = useState(0);

  useEffect(() => {
    const fetchData = async (email: string) => {
      try {
        const response = await axiosInstance.get(
          `/api/getDashboardData/${email}`
        );

        const {
          totalItemsSold,
          totalCustomers,
          totalProfit,
          totalInventoryItems,
        } = response.data;

        setInventoryCount(totalInventoryItems);
        setCustomerCount(totalCustomers);
        setTotalProfit(totalProfit);
        setTotalStockQuantity(totalItemsSold);
      } catch (error) {
        console.log("Error fetching dashboard data:", error);
      }
    };

    const storedUserDetail =
      typeof window !== "undefined" ? localStorage.getItem("userDetail") : null;

    if (storedUserDetail) {
      const initialUserState = JSON.parse(storedUserDetail);
      fetchData(initialUserState.email);
    }
  }, []); // Empty dependency array to run only once

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl text-black font-bold mb-4">DASHBOARD</h1>
      {/* <p className="text-gray-600 mb-6">Welcome to the dashboard! Here you can see an overview of the system.</p> */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card */}
        <div className="bg-blue-900 text-white p-4 rounded-lg">
          <p className="text-lg">Items in Inventory</p>
          <p className="text-2xl font-bold">{inventoryCount}</p>
        </div>
        {/* Card */}
        <div className="bg-blue-900 text-white p-4 rounded-lg">
          <p className="text-lg">Customers</p>
          <p className="text-2xl font-bold">{customerCount}</p>
        </div>
        {/* Card */}
        <div className="bg-blue-900 text-white p-4 rounded-lg">
          <p className="text-lg">Profit </p>
          <p className="text-2xl font-bold">₹{totalProfit}</p>
        </div>
        {/* Card */}
        <div className="bg-blue-900 text-white p-4 rounded-lg">
          <p className="text-lg"> Stock </p>
          <p className="text-2xl font-bold">{totalStockQuantity}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
