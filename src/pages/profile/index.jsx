import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postProfilePic } from "../../api/users";
import { hideLoader, showLoader } from "../../redux/loaderSlice";
import toast from "react-hot-toast";
import { setUser } from "../../redux/userSlice";

function Profile() {
    const { user } = useSelector((state) => state.userReducer);
    const [image, setImage] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        if (user?.profilePicture) {
            setImage(user.profilePicture);
        }
    }, [user]);

    const getFullName = () => {
        const firstName = user?.firstName || "";
        const lastName = user?.lastName || "";

        return lastName ? `${firstName} ${lastName}` : firstName;
    };

    const onFileSelect = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader(file);

        reader.readAsDataURL(file);

        reader.onloadend = async () => {
            setImage(reader.result);
        };
    };

    const updateProfilePic = async () => {
        try {
            dispatch(showLoader());
            const response = await postProfilePic(image);
            toast.success(response.message);
            dispatch(setUser(response.data));
        } catch (error) {
            toast.error(error.message);
        }
        dispatch(hideLoader());
    };

    return (
        <div className="profile-page-container">
            <div className="profile-pic-container">
                {image ? (
                    <img
                        src={image}
                        alt="Profile"
                        className="user-profile-pic-upload"
                    />
                ) : (
                    <div className="user-default-profile-avatar"></div>
                )}
            </div>
            <div className="profile-info-container">
                <div className="user-profile-name">
                    <h1>{getFullName()}</h1>
                </div>
                <div>
                    <b>Email:</b>
                    {user?.email}
                </div>
                <div className="select-profile-pic-container">
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={onFileSelect}
                    />
                    <button
                        className="profile-pic-save-btn"
                        onClick={updateProfilePic}
                        disabled={!image}
                    ></button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
