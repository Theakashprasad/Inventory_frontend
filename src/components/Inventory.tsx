import { useEffect, useRef, useState } from "react";
import axiosInstance from "../lib/axios";
import { Iinventory, Iuser } from "../Types/User";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdAddCircleOutline } from "react-icons/io";

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const modalRef = useRef<HTMLDialogElement>(null);
  const editmodalRef = useRef<HTMLDialogElement>(null);

  // States for form data
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [userData, setUserData] = useState<Iinventory[] | null>();
  const [usersDatas, setUsersDatas] = useState<Iuser | null>();
  const [getId, setId] = useState();
     
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
    if (usersDatas?.id) {
      try {
        const response = await axiosInstance.get(
          `/api/getInventory/${usersDatas.id}`
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

  // States for validation errors
  const [inputErrors, setInputErrors] = useState({
    itemName: "",
    description: "",
    quantity: "",
    price: "",
  });

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
    setItemName("");
    setDescription("");
    setQuantity("");
    setPrice("");
    setInputErrors({ itemName: "", description: "", quantity: "", price: "" });
  };

  const openEditModal = (user: Iinventory) => {
    if (editmodalRef.current) {
      setItemName(user.name); // Set the initial value for itemName
      setDescription(user.description); // Set the initial value for description
      setQuantity(user.quantity); // Set the initial value for quantity
      setPrice(user.price); // Set the initial value for price
      setId(user._id);
      editmodalRef.current.showModal();
    }
  };

  const hasNumbers = (value: string) => /\d/.test(value);

  // Function to handle form submission with validation
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Error state to store validation errors
    let errors = { itemName: "", description: "", quantity: "", price: "" };
    let hasErrors = false;

    // Item Name validation: Should not contain numbers
    if (itemName.trim() === "") {
      errors.itemName = "Item Name is required";
      hasErrors = true;
    } else if (hasNumbers(itemName)) {
      errors.itemName = "Item Name should not contain numbers";
      hasErrors = true;
    }

    // Description validation: Should not contain numbers
    if (description.trim() === "") {
      errors.description = "Description is required";
      hasErrors = true;
    } else if (hasNumbers(description)) {
      errors.description = "Description should not contain numbers";
      hasErrors = true;
    }

    const quantityNumber = Number(quantity);
    if (!quantity || quantityNumber <= 0) {
      errors.quantity = "Quantity must be greater than 0";
      hasErrors = true;
    }

    const priceNumber = Number(price);
    if (!price || priceNumber <= 0) {
      errors.price = "Price must be greater than 0";
      hasErrors = true;
    }

    setInputErrors(errors);
    try {
      if (!hasErrors) {
        modalRef.current?.close();
        console.log(itemName, description, quantity, price);

        // If there are no errors, proceed with form submission logic
        const response = await axiosInstance.post("/api/postInventory", {
          itemName,
          description,
          quantity,
          price,
          creatorId: usersDatas?.id, // Add the email to the log,
        });
        console.log("response", response);
        toast.success("SUCCESSFULLY ADDED", {
          position: "top-center",
        });
        // Close the modal after successful submission
        fetchData();

        // Reset the form fields after submission
        setItemName("");
        setDescription("");
        setQuantity("");
        setPrice("");
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

  //EDITING
  const handleEditSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Error state to store validation errors
    let errors = { itemName: "", description: "", quantity: "", price: "" };
    let hasErrors = false;

    // Item Name validation: Should not contain numbers
    if (itemName.trim() === "") {
      errors.itemName = "Item Name is required";
      hasErrors = true;
    } else if (hasNumbers(itemName)) {
      errors.itemName = "Item Name should not contain numbers";
      hasErrors = true;
    }

    // Description validation: Should not contain numbers
    if (description.trim() === "") {
      errors.description = "Description is required";
      hasErrors = true;
    } else if (hasNumbers(description)) {
      errors.description = "Description should not contain numbers";
      hasErrors = true;
    }

    const quantityNumber = Number(quantity);
    if (!quantity || quantityNumber <= 0) {
      errors.quantity = "Quantity must be greater than 0";
      hasErrors = true;
    }

    const priceNumber = Number(price);
    if (!price || priceNumber <= 0) {
      errors.price = "Price must be greater than 0";
      hasErrors = true;
    }

    setInputErrors(errors);

    if (!hasErrors) {
      editmodalRef.current?.close();

      // If there are no errors, proceed with form submission logic
      const response = await axiosInstance.patch("/api/patchInventory", {
        itemName,
        description,
        quantity,
        price,
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
      setItemName("");
      setDescription("");
      setQuantity("");
      setPrice("");
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/api/deleteInventory/${itemId}`
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
      <h1 className="text-3xl font-bold mb-4">INVENTORY MANAGEMENT</h1>
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

      {/* Table */}
      <table className="w-full text-left table-auto text-lg">
        <thead>
          <tr className="bg-gray-800 text-white text-base">
            <th className="px-6 py-4 uppercase">SL NO</th>
            <th className="px-6 py-4 uppercase">NAME</th>
            <th className="px-6 py-4 uppercase">Description</th>
            <th className="px-6 py-4 uppercase">Quantity</th>
            <th className="px-6 py-4 uppercase">Price</th>
            <th className="px-6 py-4 uppercase">Actions</th>
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
                  <td className="px-6 py-4">{user?.description}</td>
                  <td className="px-6 py-4">{user.quantity}</td>
                  <td className="px-6 py-4">{user.price}</td>
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
          <h3 className="font-bold text-lg">Add New Item</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="itemName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Item Name
              </label>
              <input
                type="text"
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  inputErrors.itemName ? "border-red-500" : "border-gray-300"
                } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
              />
              {inputErrors.itemName && (
                <p className="text-red-500 text-sm">{inputErrors.itemName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  inputErrors.description ? "border-red-500" : "border-gray-300"
                } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
              />
              {inputErrors.description && (
                <p className="text-red-500 text-sm">
                  {inputErrors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={`mt-1 p-2 block w-full rounded-md border ${
                    inputErrors.quantity ? "border-red-500" : "border-gray-300"
                  } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
                />
                {inputErrors.quantity && (
                  <p className="text-red-500 text-sm">{inputErrors.quantity}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`mt-1 p-2 block w-full rounded-md border ${
                    inputErrors.price ? "border-red-500" : "border-gray-300"
                  } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
                />
                {inputErrors.price && (
                  <p className="text-red-500 text-sm">{inputErrors.price}</p>
                )}
              </div>
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
      {/* EDIT */}
      <dialog id="my_modal_1" className="modal" ref={editmodalRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Item</h3>
          <form onSubmit={handleEditSubmit}>
            <div>
              <label
                htmlFor="itemName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Item Name
              </label>
              <input
                type="text"
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  inputErrors.itemName ? "border-red-500" : "border-gray-300"
                } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
              />
              {inputErrors.itemName && (
                <p className="text-red-500 text-sm">{inputErrors.itemName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`mt-1 p-2 block w-full rounded-md border ${
                  inputErrors.description ? "border-red-500" : "border-gray-300"
                } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
              />
              {inputErrors.description && (
                <p className="text-red-500 text-sm">
                  {inputErrors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={`mt-1 p-2 block w-full rounded-md border ${
                    inputErrors.quantity ? "border-red-500" : "border-gray-300"
                  } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
                />
                {inputErrors.quantity && (
                  <p className="text-red-500 text-sm">{inputErrors.quantity}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`mt-1 p-2 block w-full rounded-md border ${
                    inputErrors.price ? "border-red-500" : "border-gray-300"
                  } dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
                />
                {inputErrors.price && (
                  <p className="text-red-500 text-sm">{inputErrors.price}</p>
                )}
              </div>
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

export default Inventory;
