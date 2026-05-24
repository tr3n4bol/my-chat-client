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
        <main className="container">
            <div className="container-back-img"></div>
            <div className="container-back-color"></div>
            <div className="card">
                <div className="card_title">
                    <h1>Create Account</h1>
                </div>
                <div className="form">
                    <form onSubmit={onFormSubmit}>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={user.firstName}
                            onChange={(e) => {
                                setUser({ ...user, firstName: e.target.value });
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={user.lastName}
                            onChange={(e) => {
                                setUser({ ...user, lastName: e.target.value });
                            }}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={user.email}
                            onChange={(e) => {
                                setUser({ ...user, email: e.target.value });
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={user.password}
                            onChange={(e) => {
                                setUser({ ...user, password: e.target.value });
                            }}
                        />
                        <button>Sign Up</button>
                    </form>
                </div>
                <div className="card_terms">
                    <span>
                        Already have an account?
                        <Link to="/login">Login Here</Link>
                    </span>
                </div>
            </div>
        </main>
    );
}

export default SignUp;
