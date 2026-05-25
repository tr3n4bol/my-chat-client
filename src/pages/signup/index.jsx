import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../../api/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice";

function SignUp() {
    const dispatch = useDispatch();
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    async function onFormSubmit(event) {
        event.preventDefault();
        dispatch(showLoader);
        try {
            const response = await signUpUser(user);
            dispatch(hideLoader);
            toast.success(response.message);

            navigate("/login", {
                state: {
                    email: user.email,
                },
            });
        } catch (error) {
            dispatch(hideLoader);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-bg"></div>
            <main className="auth-card">
                <header className="auth-card__header">
                    <h1>Create Account</h1>
                </header>
                <form
                    className="auth-form"
                    onSubmit={onFormSubmit}
                    name="signup"
                >
                    <input
                        type="text"
                        placeholder="First Name"
                        name="signup-first_name"
                        value={user.firstName}
                        onChange={(e) => {
                            setUser({ ...user, firstName: e.target.value });
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        name="signup-last_name"
                        value={user.lastName}
                        onChange={(e) => {
                            setUser({ ...user, lastName: e.target.value });
                        }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="signup-email"
                        value={user.email}
                        onChange={(e) => {
                            setUser({ ...user, email: e.target.value });
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="signup-password"
                        value={user.password}
                        onChange={(e) => {
                            setUser({ ...user, password: e.target.value });
                        }}
                    />
                    <button className="btn btn-primary" type="submit">
                        Sign Up
                    </button>
                </form>
                <footer className="auth-card__footer">
                    <span>
                        Already have an account?
                        <Link to="/login">Login Here</Link>
                    </span>
                </footer>
            </main>
        </div>
    );
}

export default SignUp;
