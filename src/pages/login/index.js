import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../api/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader} from "../../redux/loaderSlice";

// TODO отсутствие пользователя не инвалидирует токен
// Новый пользователь -> jwt malformed
function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({
        email: location.state?.email || "",
        password: "",
    });

    const onFormSubmit = async (e) => {
        e.preventDefault();

        dispatch(showLoader());
        try {
            const response = await loginUser(user);
            dispatch(hideLoader());
            localStorage.setItem("token", response.token);
            toast.success(response.message);
            navigate("/");
        } catch (error) {
            dispatch(hideLoader());
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="container">
            <div className="container-back-img"></div>
            <div className="container-back-color"></div>
            <div className="card">
                <div className="card_title">
                    <h1>Login Here</h1>
                </div>
                <div className="form">
                    <form onSubmit={onFormSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={user.email}
                            onChange={(e) =>
                                setUser({ ...user, email: e.target.value })
                            }
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={user.password}
                            onChange={(e) =>
                                setUser({ ...user, password: e.target.value })
                            }
                        />
                        <button>Login</button>
                    </form>
                </div>
                <div className="card_terms">
                    <span>
                        Don't have an account yet?
                        <Link to="/signup">Signup Here</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Login;
