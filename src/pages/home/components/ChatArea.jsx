import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, fetchAllMessages } from "../../../api/message";
import { clearUnreadMessageCount } from "../../../api/chat";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { useEffect, useState } from "react";
import store from "../../../redux/store";
import moment from "moment/moment";
import "moment/locale/ru";
import { setAllChats } from "../../../redux/userSlice";

function ChatArea({ socket }) {
    const { selectedChat, user, allChats } = useSelector(
        (state) => state.userReducer,
    );
    const selectedUser = selectedChat.members.find((u) => u._id !== user._id);
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = async () => {
        try {
            const newMessage = {
                chatId: selectedChat._id,
                sender: user._id,
                text: message,
            };

            socket.emit("send-message", {
                ...newMessage,
                members: selectedChat.members.map((m) => m._id),
                read: false,
                createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            });

            const response = await createNewMessage(newMessage);

            if (response.success) {
                setMessage("");
            }
        } catch (error) {
            toast.error(error.message);
        }
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
        try {
            socket.emit("clear-unread-messages", {
                chatId: selectedChat._id,
                members: selectedChat.members.map((m) => m._id),
            });
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

        socket.off("receive-message").on("receive-message", (message) => {
            const selectedChat = store.getState().userReducer.selectedChat;

            if (selectedChat._id === message.chatId) {
                setAllMessages((prevMessages) => [...prevMessages, message]);
            }

            if (
                selectedChat._id === message.chatId &&
                message.sender !== user._id
            ) {
                clearUnreadMessages();
            }
        });

        socket
            .off("message-count-cleared")
            .on("message-count-cleared", (data) => {
                const selectedChat = store.getState().userReducer.selectedChat;
                const allChats = store.getState().userReducer.allChats;

                if (selectedChat._id === data.chatId) {
                    const updatedChats = allChats.map((chat) => {
                        if (chat._id === data.chatId) {
                            return {
                                ...chat,
                                unreadMessageCount: 0,
                            };
                        }

                        return chat;
                    });

                    dispatch(setAllChats(updatedChats));

                    setAllMessages((prevMessages) => {
                        return prevMessages.map((msg) => {
                            return {
                                ...msg,
                                read: true,
                            };
                        });
                    });
                }
            });

        socket.off("started-typing").on("started-typing", (data) => {
            const selectedChat = store.getState().userReducer.selectedChat;

            if (selectedChat._id === data.chatId && data.sender !== user._id) {
                setIsTyping(true);

                setTimeout(() => {
                    setIsTyping(false);
                }, 1000);
            }
        });
    }, [selectedChat]);

    useEffect(() => {
        const messagesContainer = document.getElementById("main-chat-area");
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, [allMessages]);

    return (
        <>
            {selectedChat && (
                <div className="app-chat-area">
                    <div className="app-chat-area-header">
                        {selectedUser.firstName + " " + selectedUser.lastName}
                    </div>
                    <div className="main-chat-area" id="main-chat-area">
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
                        <div className="typing-indicator">
                            <i>{isTyping && "typing..."}</i>
                        </div>
                    </div>
                    <div className="send-message-div">
                        {/* TODO черновик при переходе между чатами */}
                        <input
                            type="text"
                            className="send-message-input"
                            placeholder="Написать сообщение..."
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                socket.emit("typing", {
                                    chatId: selectedChat._id,
                                    members: selectedChat.members.map(
                                        (m) => m._id,
                                    ),
                                    sender: user._id,
                                });
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
