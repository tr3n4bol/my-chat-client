import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/protectedRoute";

function App() {
    return (
        <div>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
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
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/signup" element={<SignUp />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
