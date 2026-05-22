import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { fetchLoggedUser, fetchAllUsers } from "../api/users";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../redux/loaderSlice";
import { setAllUsers, setUser } from "../redux/userSlice";

function ProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.userReducer);

    const getLoggedInUser = async () => {
        dispatch(showLoader());
        try {
            const response = await fetchLoggedUser();

            if (response.success) {
                dispatch(setUser(response.data));
            } else {
                toast.error(response.message);
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            dispatch(hideLoader());
            navigate("/login");
        }
        dispatch(hideLoader());
    };

    const getAllUsers = async () => {
        try {
            dispatch(showLoader());
            const response = await fetchAllUsers();
            dispatch(hideLoader());
            dispatch(setAllUsers(response.data));
        } catch (error) {
            toast.error(error.message);
            navigate("/");
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getLoggedInUser();
            getAllUsers();
        } else {
            navigate("/login");
        }
    }, []);

    return <div>{children}</div>;
}

export default ProtectedRoute;
