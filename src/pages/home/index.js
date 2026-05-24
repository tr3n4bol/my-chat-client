import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import io from "socket.io-client";

const socket = io("https://chachat-server.onrender.com");

function Home() {
    const { selectedChat, user } = useSelector((state) => state.userReducer);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (user) {
            socket.emit("join-room", user._id);
            socket.emit("user-login", user._id);
            socket.on("online-users", (onlineUsers) => {
                setOnlineUsers(onlineUsers);
            });
            socket.on("online-users-updated", (onlineUsers) => {
                setOnlineUsers(onlineUsers);
            });
        }
    }, [user, onlineUsers]);

    return (
        <div className="app-page">
            <Header socket={socket} />
            <div className="app-shell">
                <Sidebar socket={socket} onlineUsers={onlineUsers} />
                <section className="chat-shell">
                    {selectedChat ? (
                        <ChatArea socket={socket} />
                    ) : (
                        <div className="empty-chat-state">
                            <div className="empty-chat-state__icon">
                                <i
                                    className="fa fa-comments"
                                    aria-hidden="true"
                                ></i>
                            </div>
                            <h2>Select a chat</h2>
                            <p>
                                Choose a conversation from the sidebar to start
                                messaging.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Home;
