import { useEffect, useRef, useState } from "react";
import axiosInstance from "../lib/axios";
import { Icustomer, Iuser } from "../Types/User";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdAddCircleOutline } from "react-icons/io";

const Customer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [userData, setUserData] = useState<Icustomer[] | null>();
  const [usersDatas, setUsersDatas] = useState<Iuser | null>();
  const [getId, setId] = useState();

  const modalRef = useRef<HTMLDialogElement>(null);
  const editmodalRef = useRef<HTMLDialogElement>(null);

  const [inputErrors, setInputErrors] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
  });
  useEffect(() => {
    let initialUserState = null;
    const storedUserDetail =
      typeof window !== "undefined" ? localStorage.getItem("userDetail") : null;
    if (storedUserDetail) {
      initialUserState = storedUserDetail ? JSON.parse(storedUserDetail) : null;
      setUsersDatas(initialUserState);
    }
  }, [setUsersDatas]);

  const fetchData = async () => {
    if (usersDatas?.email) {
      try {
        const response = await axiosInstance.get(
          `/api/getCustomer/${usersDatas.id}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    } else {
      console.error("User email is not available");
    }
  };

  useEffect(() => {
    fetchData();
  }, [usersDatas]);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
    setCustomerName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setInputErrors({ customerName: "", email: "", phone: "", address: "" });
  };

  const openEditModal = (user: Icustomer) => {
    if (editmodalRef.current) {
      setCustomerName(user.name); // Set the initial value for itemName
      setEmail(user.email); // Set the initial value for description
      setPhone(user.phone); // Set the initial value for quantity
      setAddress(user.address); // Set the initial value for price
      setId(user._id);
      editmodalRef.current.showModal();
    }
  };

  const hasNumbers = (value: string) => /\d/.test(value);
  const isValidPhoneNumber = (phone: string) => /^[0-9]{10}$/.test(phone);

  // Function to handle form submission with validation
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Error state to store validation errors
    let errors = { customerName: "", email: "", phone: "", address: "" };
    let hasErrors = false;

    // Customer Name validation: Should not contain numbers
    if (customerName.trim() === "") {
      errors.customerName = "Customer Name is required";
      hasErrors = true;
    } else if (hasNumbers(customerName)) {
      errors.customerName = "Customer Name should not contain numbers";
      hasErrors = true;
    }

    // Email validation
    if (email.trim() === "") {
      errors.email = "Email is required";
      hasErrors = true;
    }

    // Phone validation: Must contain only numbers and be between 7 to 15 digits
    if (phone.trim() === "") {
      errors.phone = "Phone number is required";
      hasErrors = true;
    } else if (!isValidPhoneNumber(phone)) {
      errors.phone = "Phone number must be between 10 digits";
      hasErrors = true;
    }

    // Address validation: Should not contain numbers
    if (address.trim() === "") {
      errors.address = "Address is required";
      hasErrors = true;
    } else if (hasNumbers(address)) {
      errors.address = "Address should not contain numbers";
      hasErrors = true;
    }

    setInputErrors(errors);
    try {
      if (!hasErrors) {
        modalRef.current?.close();
        console.log("usersDatas", usersDatas);

        // If there are no errors, proceed with form submission logic
        const response = await axiosInstance.post("/api/postCustomer", {
          customerName,
          email,
          phone,
          address,
          creatorId: usersDatas?.id, // Add the email to the log
        });
        console.log("response", response);
        toast.success("SUCCESSFULLY ADDED", {
          position: "top-center",
        });
        // Close the modal after successful submission
        fetchData();

        // Reset the form fields after submission
        setCustomerName("");
        setEmail("");
        setPhone("");
        setAddress("");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error?.response?.data.message ||
            "An error occurred. Please try again.",
          {
            position: "top-left",
          }
        );
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };
  //EDIT
  const handleEditSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Error state to store validation errors
    let errors = { customerName: "", email: "", phone: "", address: "" };
    let hasErrors = false;

    // Customer Name validation: Should not contain numbers
    if (customerName.trim() === "") {
      errors.customerName = "Customer Name is required";
      hasErrors = true;
    } else if (hasNumbers(customerName)) {
      errors.customerName = "Customer Name should not contain numbers";
      hasErrors = true;
    }

    // Email validation
    if (email.trim() === "") {
      errors.email = "Email is required";
      hasErrors = true;
    }

    // Phone validation: Must contain only numbers and be between 7 to 15 digits
    if (phone.trim() === "") {
      errors.phone = "Phone number is required";
      hasErrors = true;
    } else if (!isValidPhoneNumber(phone)) {
      errors.phone = "Phone number must be between 10 digits";
      hasErrors = true;
    }

    // Address validation: Should not contain numbers
    if (address.trim() === "") {
      errors.address = "Address is required";
      hasErrors = true;
    } else if (hasNumbers(address)) {
      errors.address = "Address should not contain numbers";
      hasErrors = true;
    }

    setInputErrors(errors);
    try {
      if (!hasErrors) {
        editmodalRef.current?.close();
        console.log("usersDatas", usersDatas);

        // If there are no errors, proceed with form submission logic
        const response = await axiosInstance.patch("/api/patchCustomer", {
          customerName,
          email,
          phone,
          address,
          creatorId: usersDatas?.id, // Add the email to the log
          getId,
        }).then((response) => {
          console.log("response", response);
          toast.success("SUCCESSFULLY ADDED", {
            position: "top-center",
          });
          // Close the modal after successful submission
          fetchData();
        })
        .catch((error) => {
          // Handle error response
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.error || "Error updating item", {
              position: "top-center",
            });
          } else {
            toast.error("Internal Server Error", {
              position: "top-center",
            });
          }
        });
  

        // Reset the form fields after submission
        setCustomerName("");
        setEmail("");
        setPhone("");
        setAddress("");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error?.response?.data.message ||
            "An error occurred. Please try again.",
          {
            position: "top-left",
          }
        );
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/api/deleteCustomer/${itemId}`
      );
      if (response.data.message) {
        fetchData();

        toast.success(response.data.message, {
          position: "top-center",
        });
      }
    } catch (error) {}
  };
  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold mb-4">CUSTOMER MANAGEMENT</h1>
      <div className="mb-6 flex justify-center">
        <input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-half p-1 rounded-3xl bg-white border border-b-8 mr-5"
        />
        <button
          type="submit"
          onClick={openModal}
          className="inline-block rounded-full text-4xl font-medium uppercase leading-normal text-black shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:bg-blue-700  dark:hover:bg-blue-500 dark:focus:ring-blue-600 dark:active:bg-blue-600"
        >
          <IoMdAddCircleOutline />
        </button>
      </div>
      {/* Card */}
      <table className="w-full text-left table-auto text-lg ">
        <thead>
          <tr className=" bg-gray-800 text-white text-base">
            <th className="px-6 py-4">SL NO</th>
            <th className="px-6 py-4">CUSTOMER</th>
            <th className="px-6 py-4">E-MAIL</th>
            <th className="px-6 py-4">ADDRESS</th>
            <th className="px-6 py-4">PHONE</th>
            <th className="px-6 py-4">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {userData &&
            userData
              ?.filter((data) => data.name.includes(searchQuery))
              .map((user, index) => (
                <tr key={index} className=" border-b border-b-black text-sm">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{user?.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user?.address}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4 ">
                    <div className="flex gap-x-3">
                      <button
                        onClick={() => openEditModal(user)}
                        className="btn btn-outline btn-primary"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="btn btn-outline btn-secondary"
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {/* Modal */}
      <dialog id="my_modal_1" className="modal" ref={modalRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Customer</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  inputErrors.customerName
                    ? "border-red-500"
                    : "border-gray-300"
                } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
              />
              {inputErrors.customerName && (
                <p className="text-red-500 text-sm">
                  {inputErrors.customerName}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  inputErrors.email ? "border-red-500" : "border-gray-300"
                } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
              />
              {inputErrors.email && (
                <p className="text-red-500 text-sm">{inputErrors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  inputErrors.phone ? "border-red-500" : "border-gray-300"
                } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
              />
              {inputErrors.phone && (
                <p className="text-red-500 text-sm">{inputErrors.phone}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  inputErrors.address ? "border-red-500" : "border-gray-300"
                } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
              />
              {inputErrors.address && (
                <p className="text-red-500 text-sm">{inputErrors.address}</p>
              )}
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
      </dialog>
      {/* EDITING */}
      <dialog id="edit_customer_modal" className="modal" ref={editmodalRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Customer</h3>
          <form onSubmit={handleEditSubmit}>
            <div>
              <label
                htmlFor="editCustomerName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Customer Name
              </label>
              <input
                type="text"
                id="editCustomerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  inputErrors.customerName
                    ? "border-red-500"
                    : "border-gray-300"
                } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
              />
              {inputErrors.customerName && (
                <p className="text-red-500 text-sm">
                  {inputErrors.customerName}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="editEmail"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="editEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  inputErrors.email ? "border-red-500" : "border-gray-300"
                } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
              />
              {inputErrors.email && (
                <p className="text-red-500 text-sm">{inputErrors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="editPhone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone
              </label>
              <input
                type="text"
                id="editPhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  inputErrors.phone ? "border-red-500" : "border-gray-300"
                } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
              />
              {inputErrors.phone && (
                <p className="text-red-500 text-sm">{inputErrors.phone}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="editAddress"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Address
              </label>
              <input
                type="text"
                id="editAddress"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  inputErrors.address ? "border-red-500" : "border-gray-300"
                } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
              />
              {inputErrors.address && (
                <p className="text-red-500 text-sm">{inputErrors.address}</p>
              )}
            </div>

            <div className="modal-action">
              <button type="submit" className="btn bg-blue-500 text-white">
                Submit
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => editmodalRef.current?.close()}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Customer;
