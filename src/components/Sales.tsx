import { useEffect, useRef, useState } from "react";
import { Icustomer, Iinventory, Isale } from "../Types/User";
import axiosInstance from "../lib/axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const Sales = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [sales, setSales] = useState<Isale[] | null>(null);
  const [items, setItems] = useState<Iinventory[] | null>(null);
  const [customers, setCustomers] = useState<Icustomer[] | null>(null);
  const [usersDatas, setUsersDatas] = useState<Iinventory | null>();
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  useEffect(() => {
    let initialUserState = null;
    const storedUserDetail =
      typeof window !== "undefined" ? localStorage.getItem("userDetail") : null;
    if (storedUserDetail) {
      initialUserState = storedUserDetail ? JSON.parse(storedUserDetail) : null;
      setUsersDatas(initialUserState);
    }
  }, [setUsersDatas]);

  useEffect(() => {
    if (usersDatas) {
      fetchSales();
      fetchItemsAndCustomers();
    }
  }, [usersDatas]);

  const fetchSales = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/getSale/${usersDatas?.email}`
      );

      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const fetchItemsAndCustomers = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/getInventory/${usersDatas?.email}`
      );
      const customersResponse = await axiosInstance.get(
        `/api/getCustomer/${usersDatas?.email}`
      );
      setItems(response.data);
      setCustomers(customersResponse.data);
    } catch (error) {
      console.error("Error fetching items and customers:", error);
    }
  };

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const selectedInventoryItem: any = items?.find(
      (item) => item.name === selectedItem
    );

    if (quantity > selectedInventoryItem?.quantity) {
      setError("Quantity exceeds available stock.");
      return;
    }
    try {
      await axiosInstance.post("/api/postSale", {
        itemName: selectedItem,
        customerName: selectedCustomer,
        quantity,
        email: usersDatas?.email, // Add the email to the log,
      });
      toast.success("SUCCESSFULLY ADDED", {
        position: "top-center",
      });
      fetchSales();
      fetchItemsAndCustomers()
      modalRef.current?.close();
      setSelectedItem("");
      setSelectedCustomer("");
      setQuantity(1);
      setError("");
    } catch (error) {
      console.error("Error recording sale:", error);
    }
  };
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Data", 14, 16);

    // Generate table using autoTable plugin
    doc.autoTable({
      startY: 26, // Adjust this value to add space between the text and the table
      head: [["Item", "Customer", "Quantity", "Cash", "Sale Date"]],
      body:
        sales &&
        sales.map((sale) => [
          sale.itemName,
          sale.customerName,
          sale.quantity,
          `₹ ${sale.cash}`,
          new Date(sale.saleDate).toLocaleDateString(),
        ]),
    });

    doc.save("sales_data.pdf");
  };

  const downloadExcel = () => {
    if (!sales) {
      console.error("Sales data is not available.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      sales.map((sale) => ({
        Item: sale.itemName,
        Customer: sale.customerName,
        Quantity: sale.quantity,
        Cash: `₹${sale.cash}`,
        "Sale Date": new Date(sale.saleDate).toLocaleDateString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
    XLSX.writeFile(workbook, "sales_data.xlsx");
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold mb-4">SALES REPORT</h1>
      <div className="mb-6 mx-10 flex justify-between items-center w-[30%] space-x-5">
        <button
          onClick={openModal}
          type="submit"
          className="inline-block rounded bg-blue-500 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600 dark:active:bg-blue-600"
        >
          RECORD SALE
        </button>
        <button
          onClick={downloadPDF}
          type="submit"
          className="inline-block rounded bg-blue-500 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600 dark:active:bg-blue-600"
        >
          DOWNLOAD PDF
        </button>
        <button
          onClick={downloadExcel}
          type="submit"
          className="inline-block rounded bg-blue-500 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600 dark:active:bg-blue-600"
        >
          DOWNLOAD EXCEL
        </button>
      </div>
      {/* Card */}
      <table className="w-full text-left table-auto text-lg ">
        <thead>
          <tr className=" bg-gray-800 text-white text-base">
            <th className="px-6 py-4">SL NO</th>
            <th className="px-6 py-4">PRODUCT</th>
            <th className="px-6 py-4">CUSTOMER</th>
            <th className="px-6 py-4">QUANTITY</th>
            <th className="px-6 py-4">CASH</th>
            <th className="px-6 py-4">SALE DATE</th>
          </tr>
        </thead>
        <tbody>
          {sales &&
            sales.map((user, index) => (
              <tr key={index} className=" border-b border-b-black text-sm">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{user?.itemName}</td>
                <td className="px-6 py-4">{user.customerName}</td>
                <td className="px-6 py-4">{user?.quantity}</td>
                <td className="px-6 py-4">{user.cash}</td>
                <td className="px-6 py-4">
                  {new Date(user.saleDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <dialog id="my_modal_1" className="modal" ref={modalRef}>
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-md w-96">
            <h2 className="text-lg font-bold text-white mb-4">Record Sale</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Item
                </label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="p-2 w-full border rounded-md bg-gray-700 text-white border-gray-600"
                  required
                >
                  <option value="">Select Item</option>
                  {items?.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name} (Stock: {item.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Customer
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="p-2 w-full border rounded-md bg-gray-700 text-white border-gray-600"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers?.map((customer, index) => (
                    <option key={index} value={customer.name}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity === 0 ? "" : quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setQuantity(0);
                    } else {
                      setQuantity(Math.max(1, Number(value))); // Ensure minimum value of 1
                    }
                  }}
                  className="p-2 w-full border rounded-md bg-gray-700 text-white border-gray-600"
                  required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <div className="modal-action">
                <button type="submit" className="btn bg-blue-500 text-white">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => modalRef.current?.close()}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Sales;
