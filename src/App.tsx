import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import useStore from "./store/user";
function App() {
const { isAuth } = useStore();
  console.log('asfd',typeof isAuth);

  return (
    <>
      <div className="flex justify-center bg-white">
        <Routes>
          <Route
            path="/"
            element={isAuth ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/login"
            element={isAuth ?  <Navigate to={"/"} />: <Login />}
          />
          <Route
            path="/signup"
            element={isAuth ?  <Navigate to={"/"} />: <Signup />}
          />
        </Routes> 
      </div>
    </>
  );
}

export default App;
