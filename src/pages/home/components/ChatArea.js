import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, fetchAllMessages } from "../../../api/message";
import { clearUnreadMessageCount } from "../../../api/chat";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import "moment/locale/ru";

function ChatArea() {
    const { selectedChat, user, allChats } = useSelector(
        (state) => state.userReducer,
    );
    const selectedUser = selectedChat.members.find((u) => u._id !== user._id);
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [allMessages, setAllMessages] = useState([]);

    const sendMessage = async () => {
        try {
            const newMessage = {
                chatId: selectedChat._id,
                sender: user._id,
                text: message,
            };
            dispatch(showLoader());
            const response = await createNewMessage(newMessage);
            if (response.success) setMessage("");
        } catch (error) {
            toast.error(error.message);
        }
        dispatch(hideLoader());
    };

    const getMessages = async () => {
        dispatch(showLoader());
        try {
            const response = await fetchAllMessages(selectedChat._id);
            setAllMessages(response.data);
        } catch (error) {
            toast.error(error.message);
        }
        dispatch(hideLoader());
    };

    const clearUnreadMessages = async () => {
        dispatch(showLoader());
        try {
            const response = await clearUnreadMessageCount(selectedChat._id);
            allChats.map((c) => {
                if (c._id === selectedChat._id) {
                    return response.data;
                }
                return c;
            });
        } catch (error) {
            toast.error(error.message);
        }
        dispatch(hideLoader());
    };

    const formatTime = (timestamp) => {
        moment.locale("ru");
        const now = moment();

        const diff = now.diff(timestamp, "days");

        if (diff < 1) {
            return `Сегодня ${moment(timestamp).format("HH:mm")}`;
        } else if (diff === 1) {
            return `Вчера ${moment(timestamp).format("HH:mm")}`;
        } else {
            return `${moment(timestamp).format("MMMM D, HH:mm")}`;
        }
    };

    useEffect(() => {
        getMessages();
        if (selectedChat?.lastMessage?.sender !== user._id) {
            clearUnreadMessages();
        }
    }, [selectedChat]);

    return (
        <>
            {selectedChat && (
                <div className="app-chat-area">
                    <div className="app-chat-area-header">
                        {selectedUser.firstName + " " + selectedUser.lastName}
                    </div>
                    <div className="main-chat-area">
                        {allMessages.map((m) => {
                            const isSender = m.sender === user._id;
                            return (
                                <div
                                    className="message-container"
                                    style={
                                        isSender
                                            ? { justifyContent: "end" }
                                            : { justifyContent: "start" }
                                    }
                                >
                                    <div>
                                        <div
                                            className={
                                                isSender
                                                    ? "send-message"
                                                    : "received-message"
                                            }
                                        >
                                            {m.text}
                                        </div>
                                        <div
                                            className="message-timestamp"
                                            style={
                                                isSender
                                                    ? { float: "right" }
                                                    : { float: "left" }
                                            }
                                        >
                                            {formatTime(m.createdAt)}{" "}
                                            {isSender && m.read && (
                                                <i
                                                    className="fa fa-check-circle"
                                                    aria-hidden="true"
                                                    style={{ color: "#f73210" }}
                                                ></i>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="send-message-div">
                        <input
                            type="text"
                            className="send-message-input"
                            placeholder="Написать сообщение..."
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                console.log(e.target.value);
                            }}
                        ></input>
                        <button
                            className="fa fa-paper-plane send-message-btn"
                            aria-hidden="true"
                            onClick={sendMessage}
                        ></button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatArea;
