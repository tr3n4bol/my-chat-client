import { axiosInstance } from "./index";

export const fetchLoggedUser = async () => {
    const response = await axiosInstance.get("/api/user/get-logged-user");
    return response.data;
};

export const fetchAllUsers = async () => {
    const response = await axiosInstance.get("/api/user/get-all-users");
    return response.data;
};

export const postProfilePic = async (image) => {
    const response = await axiosInstance.post("/api/user/upload-profile-pic", {
        image,
    });
    return response.data;
};
