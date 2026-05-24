import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../api/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice";

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
        <div className="auth-page">
            <div className="auth-bg"></div>

            <main className="auth-card">
                <header className="auth-card__header">
                    <h1>Login</h1>
                    <p>Sign in to continue to your chats.</p>
                </header>

                <form
                    className="auth-form"
                    onSubmit={onFormSubmit}
                    name="login"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        name="login-email"
                        value={user.email}
                        onChange={(e) =>
                            setUser({ ...user, email: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        name="login-password"
                        value={user.password}
                        onChange={(e) =>
                            setUser({ ...user, password: e.target.value })
                        }
                    />

                    <button className="btn btn-primary" type="submit">
                        Login
                    </button>
                </form>

                <footer className="auth-card__footer">
                    <span>Don't have an account yet?</span>
                    <Link to="/signup">Signup here</Link>
                </footer>
            </main>
        </div>
    );
}

export default Login;
