import { useState } from "react";
import Search from "./Search";

function Sidebar() {
    const [searchKey, setSearchKey] = useState("");

    return (
        <div className="app-sidebar">
            <Search searchKey={searchKey} setSearchKey={setSearchKey} />
        </div>
    );
}

export default Sidebar;
