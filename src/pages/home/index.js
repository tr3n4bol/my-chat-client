import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function Home() {
    return (
        <div className="home-page">
            <Header />
            <div className="main-content">
                <Sidebar />
            </div>
        </div>
    );
}

export default Home;
