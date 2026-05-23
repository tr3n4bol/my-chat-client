import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Profile from "./pages/profile";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/protectedRoute";
import Loader from "./components/Loader";
import { useSelector } from "react-redux";

function App() {
    const { loader } = useSelector((state) => state.loaderReducer);
    return (
        <div>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            {loader && <Loader />}
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    ></Route>
                    <Route
                        path="/profile"
                        element={ 
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    ></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/signup" element={<SignUp />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
