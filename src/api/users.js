import { axiosInstance } from "./index";

export const getLoggedUser = async () => {
    const response = await axiosInstance.get("/api/user/get-logged-user");
    return response.data;
};
