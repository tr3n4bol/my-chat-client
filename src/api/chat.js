import { axiosInstance, url } from "./index";

export const getAllChats = async (user) => {
    const response = await axiosInstance.get("/api/chat/get-all-chats", user);
    return response.data;
};

export const createNewChat = async (members) => {
    const response = await axiosInstance.post("/api/chat/create-new-chat", {
        members,
    });
    return response.data;
};

export const clearUnreadMessageCount = async (chatId) => {
    const response = await axiosInstance.post(
        "/api/chat/clean-unread-messages",
        { chatId: chatId },
    );
    return response.data;
};
