import { axiosInstance } from "./index";

export const signUpUser = async (user) => {
    const response = await axiosInstance.post("/api/auth/signup", user);
    return response.data;
};

export const loginUser = async (user) => {
    const response = await axiosInstance.post("/api/auth/login", user);
    return response.data;
};
