import { axiosInstance, url } from "./index";

export const signUpUser = async (user) => {
    const response = await axiosInstance.post(url + "/api/auth/signup", user);
    return response.data;
};

export const loginUser = async (user) => {
    const response = await axiosInstance.post(url + "/api/auth/login", user);
    return response.data;
};
