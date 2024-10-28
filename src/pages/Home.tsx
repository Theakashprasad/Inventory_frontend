import { useEffect, useState } from "react";
import Inventory from "../components/Inventory";
import Customer from "../components/Customer";
import Sales from "../components/Sales";
import Dashboard from "../components/Dashboard";
import { Iuser } from "../Types/User";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import useStore from "../store/user";

const Home = () => {
  const [isClicked, setIsClicked] = useState(1);
  const [usersDatas, setUsersDatas] = useState<Iuser | null>();
  const router = useNavigate();
const { setIsAuth } = useStore();

  useEffect(() => {
    let initialUserState = null;
    const storedUserDetail =
      typeof window !== "undefined" ? localStorage.getItem("userDetail") : null;
    if (storedUserDetail) {
      initialUserState = storedUserDetail ? JSON.parse(storedUserDetail) : null;
      setUsersDatas(initialUserState);
    }
  }, [setUsersDatas]);

  const renderPage = () => {
    switch (isClicked) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Inventory />;
      case 3:
        return <Customer />;
      case 4:
        return <Sales />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = () => {
    setIsAuth(false)
    localStorage.removeItem("userDetail");  // Remove user data from localStorage
    router("/login"); // Redirect to login page
  };

  return (
    <div className="flex h-screen w-full ">
      {/* Sidebar */}
      <div className="bg-gray-200 text-white w-72 p-6">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-gray-700 p-2 mb-4">
            <img
              src={usersDatas?.profilePic}
              alt="profile"
              className="rounded-full h-32"
            />
          </div>
          <p className="text-xl text-black">{usersDatas?.fullname}</p>
          <p className="text-sm text-black">{usersDatas?.email} </p>
        </div>
        <div className="mt-10">
          <ul>
            <li
              onClick={() => setIsClicked(1)}
              className={`text-black hover:bg-gray-300 p-2 rounded ${
                isClicked === 1 ? "bg-slate-300" : ""
              }`}
            >
              Dashboard
            </li>
            <li
              onClick={() => setIsClicked(2)}
              className={`text-black hover:bg-gray-300 p-2 rounded ${
                isClicked === 2 ? "bg-slate-300" : ""
              }`}
            >
              Inventory
            </li>
            <li
              onClick={() => setIsClicked(3)}
              className={`text-black hover:bg-gray-300 p-2 rounded ${
                isClicked === 3 ? "bg-slate-300" : ""
              }`}
            >
              Customers
            </li>
            <li
              onClick={() => setIsClicked(4)}
              className={`text-black hover:bg-gray-300 p-2 rounded ${
                isClicked === 4 ? "bg-slate-300" : ""
              }`}
            >
              Sales
            </li>
          </ul>
        </div>
      </div>

      {/* Dashboard Content */}

      {renderPage()}

      <div className="">
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 text-3xl cursor-pointer"
        >
          <RiLogoutBoxLine />
        </button>
      </div>
    </div>
  );
};

export default Home;
