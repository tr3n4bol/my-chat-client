import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "../../../api/chat";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";
import moment from "moment";

function UsersList({ searchKey }) {
    const {
        user: currUser,
        allUsers,
        allChats,
        selectedChat,
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
                chat.members.map((m) => m._id).includes(currUser._id) &&
                chat.members.map((m) => m._id).includes(selectedUserId),
        );

        if (chat) {
            dispatch(setSelectedChat(chat));
        }
    };

    const getLastMessageTimestamp = (userId) => {
        const chat = allChats.find((chat) =>
            chat.members.map((m) => m._id).includes(userId),
        );
        if (!chat || chat?.lastMessage) {
            return "";
        } else {
            return moment(chat?.lastMessage?.createdAt).format("HH:mm");
        }
    };

    const getLastMessage = (userId) => {
        const chat = allChats.find((chat) =>
            chat.members.map((m) => m._id).includes(userId),
        );

        return chat?.lastMessage?.text?.substring(0, 25) || "";
    };

    const getUnreadMessageCount = (userId) => {
        const chat = allChats.find(
            (c) => c.members.map((m) => m._id).includes(userId), // ',' ?
        );

        if (
            chat &&
            chat.unreadMessageCount &&
            chat.lastMessage?.sender !== currUser._id
        ) {
            return (
                <div className="unread-message-counter">
                    {chat.unreadMessageCount}
                </div>
            );
        } else {
            return "";
        }
    };

    const isSelectedChat = (user) => {
        if (selectedChat)
            return selectedChat.members.map((m) => m._id).includes(user._id);
        return false;
    };

    const getData = () => {
        if (searchKey === "") {
            return allChats;
        } else {
            allUsers.filter((user) => {
                return (
                    ((user.firstName
                        .toLowerCase()
                        .includes(searchKey.toLowerCase()) ||
                        user.lastName
                            .toLowerCase()
                            .includes(searchKey.toLowerCase())) &&
                        searchKey) ||
                    allChats.some((chat) =>
                        chat.members.map((m) => m._id).includes(user._id),
                    )
                );
            });
        }
    };

    return getData().map((obj) => {
        let user = obj;
        if (obj.members) {
            user = obj.members.find((m) => m._id != currUser._id);
        }
        return (
            <div
                className="user-search-filter"
                onClick={() => openChat(user._id)}
                key={user._id}
            >
                <div
                    className={
                        isSelectedChat(user) ? "selected-user" : "filtered-user"
                    }
                >
                    <div className="filter-user-display">
                        {user.profilePic ? (
                            <img
                                src={user.profilePic}
                                alt="Profile"
                                className="user-profile-image"
                            ></img>
                        ) : (
                            <div
                                className={
                                    isSelectedChat(user)
                                        ? "user-selected-avatar"
                                        : "user-default-avatar"
                                }
                            >
                                {user.firstName.charAt(0) +
                                    user.lastName.charAt(0) || ""}
                            </div>
                        )}

                        <div className="filter-user-details">
                            <div className="user-display-name">
                                {user.firstName + " " + user.lastName}
                            </div>
                            <div className="user-display-email">
                                {getLastMessage(user._id)}
                            </div>
                            {getUnreadMessageCount(user._id)}
                            <div className="last-message-timestamp message-timestamp">
                                {getLastMessageTimestamp(user._id)}
                            </div>
                            {!allChats.find((chat) =>
                                chat.members
                                    .map((m) => m._id)
                                    .includes(user._id),
                            ) && (
                                <div className="user-start-chat">
                                    <button
                                        className="user-start-chat-button"
                                        onClick={() => startNewChat(user._id)}
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
