import { useSelector } from "react-redux";

function Header() {
    const { user } = useSelector((state) => state.userReducer);

    const getFullName = () => {
        const firstName = user?.firstName || "";
        const lastName = user?.lastName || "";

        return lastName ? `${firstName} ${lastName}` : firstName;
    };

    return (
        <div className="app-header">
            <div className="app-logo">
                <i className="fa fa-comments" aria-hidden="true">
                    My-chat
                </i>
            </div>
            <div className="app-user-profile">
                <div className="logged-user-name">{getFullName()}</div>
                <div className="logged-user-profile-pic"></div>
            </div>
        </div>
    );
}

export default Header;
