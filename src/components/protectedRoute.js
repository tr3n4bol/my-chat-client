import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../api/users";

// TODO При смене пользователя user не перезаписывается и требует рендер
function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const getLoggedInUser = async () => {
        try {
            const response = await getLoggedUser();

            if (response.success) {
                setUser(response.data);
            } else {
                toast.error(response.message);
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            navigate("/login");
        }
    };
    useEffect(() => {
        if (localStorage.getItem("token")) {
            getLoggedInUser();
        } else {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div>
            <p>{`${user?.firstName || ""} ${user?.lastName || ""}`}</p>
            {children}
        </div>
    );
}

export default ProtectedRoute;
