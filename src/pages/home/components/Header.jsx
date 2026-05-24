import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";

function Header({ socket }) {
    const { user } = useSelector((state) => state.userReducer);
    const navigate = useNavigate();

    const getFullName = () => {
        const firstName = user?.firstName || "";
        const lastName = user?.lastName || "";

        return lastName ? `${firstName} ${lastName}` : firstName;
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
        socket.emit("user-logout", user._id);
    };

    return (
        <div className="app-header">
            <div className="app-logo">
                <i className="fa fa-comments" aria-hidden="true">
                    My-chat
                </i>
            </div>
            {/* TODO refactor */}
            <div className="app-user-profile">
                {user?.profilePicture ? (
                    <img
                        className="logged-user-profile-pic"
                        src={user.profilePicture}
                        onClick={() => navigate("/profile")}
                    />
                ) : (
                    <div
                        className="logged-user-profile-pic"
                        onClick={() => navigate("/profile")}
                    ></div>
                )}
                <div className="logged-user-name">{getFullName()}</div>
                <button className="logout-button" onClick={logout}>
                    <i className="fa fa-power-off"></i>
                </button>
            </div>
        </div>
    );
}

export default Header;
