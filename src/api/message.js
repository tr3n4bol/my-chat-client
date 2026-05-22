import { axiosInstance } from ".";

export const createNewMessage = async (message) => {
    const response = await axiosInstance.post(
        "/api/message/new-message",
        message,
    );
    return response.data;
};

export const fetchAllMessages = async (chatId) => {
    const response = await axiosInstance.get(
        `/api/message/get-all-messages/${chatId}`,
    );
    return response.data;
};
