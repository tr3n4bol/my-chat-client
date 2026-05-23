import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import io from "socket.io-client";

function Home() {
    const { selectedChat } = useSelector((state) => state.userReducer);
    const socket = io("http:localhost:5000");

    return (
        <div className="home-page">
            <Header />
            <div className="main-content">
                <Sidebar />
                {selectedChat && <ChatArea />}
            </div>
        </div>
    );
}

export default Home;
