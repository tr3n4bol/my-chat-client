import { axiosInstance, url } from ".";

export const createNewMessage = async (message) => {
    const response = await axiosInstance.post(
        url + "/api/message/new-message",
        message,
    );
    return response.data;
};

export const fetchAllMessages = async (chatId) => {
    const response = await axiosInstance.get(
        `${url}/api/message/get-all-messages/${chatId}`,
    );
    return response.data;
};
