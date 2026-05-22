import { useState } from "react";
import Search from "./Search";
import UsersList from "./UsersList";

function Sidebar() {
    const [searchKey, setSearchKey] = useState("");

    return (
        <div className="app-sidebar">
            <Search searchKey={searchKey} setSearchKey={setSearchKey} />
            <UsersList searchKey={searchKey} />
        </div>
    );
}

export default Sidebar;
