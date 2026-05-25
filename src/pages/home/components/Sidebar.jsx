import { useState } from "react";
import Search from "./Search";
import UsersList from "./UsersList";

function Sidebar({ socket, onlineUsers }) {
    const [searchKey, setSearchKey] = useState("");

    return (
        <div className="sidebar">
            <Search searchKey={searchKey} setSearchKey={setSearchKey} />
            <UsersList
                socket={socket}
                searchKey={searchKey}
                onlineUsers={onlineUsers}
            />
        </div>
    );
}

export default Sidebar;
