import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "../../../api/chat";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";

function UsersList({ searchKey }) {
    const {
        user: currUser,
        allUsers,
        allChats,
    } = useSelector((state) => state.userReducer);

    const dispatch = useDispatch();

    const startNewChat = async (selectedUserId) => {
        dispatch(showLoader());
        try {
            const response = await createNewChat([
                currUser._id,
                selectedUserId,
            ]);
            toast.success("Chat created!");
            const newChat = response.data;
            const updatedChat = [...allChats, newChat];
            dispatch(setAllChats(updatedChat));
            dispatch(setSelectedChat(newChat));
        } catch (error) {
            toast.error(error.message);
        }
        dispatch(hideLoader());
    };

    const openChat = (selectedUserId) => {
        const chat = allChats.find(
            (chat) =>
                chat.members.includes(currUser._id) &&
                chat.members.includes(selectedUserId),
        );

        if (chat) {
            dispatch(setSelectedChat(chat));
        }
    };

    return allUsers
        .filter((user) => {
            return (
                ((user.firstName
                    .toLowerCase()
                    .includes(searchKey.toLowerCase()) ||
                    user.lastName
                        .toLowerCase()
                        .includes(searchKey.toLowerCase())) &&
                    searchKey) ||
                allChats.some((chat) => chat.members.includes(user._id))
            );
        })
        .map((user) => {
            return (
                <div
                    className="user-search-filter"
                    onClick={() => openChat(user._id)}
                    key={user._id}
                >
                    <div className="filtered-user">
                        <div className="filter-user-display">
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt="Profile"
                                    className="user-profile-image"
                                ></img>
                            ) : (
                                <div className="user-default-avatar">
                                    {user.firstName.charAt(0) +
                                        user.lastName.charAt(0) || ""}
                                </div>
                            )}

                            <div className="filter-user-details">
                                <div className="user-display-name">
                                    {user.firstName + " " + user.lastName}
                                </div>
                                <div className="user-display-email">
                                    {user.email}
                                </div>
                                {!allChats.find((chat) =>
                                    chat.members.includes(user._id),
                                ) && (
                                    <div className="user-start-chat">
                                        <button
                                            className="user-start-chat-button"
                                            onClick={() =>
                                                startNewChat(user._id)
                                            }
                                        >
                                            Start chat
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
}

export default UsersList;
