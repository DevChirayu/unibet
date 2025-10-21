import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
// import arrows from "../../../../assets/images/icons/carousel_leftarrow.svg";
import {
  makeAjax,
  respStatus,
  showMessage,
  url,
} from "../../../../helpers/global_helper";
import { getUserProfile } from "../../../../redux/actions";
import usericon from "../../../../assets/images/icons/usericon.png";

const ProfileModal = (props) => {
  const [showMsgSubmit, setShowMsgSubmit] = useState(false);
  const [showMsgUpload, setshowMsgUpload] = useState(false);
  const { onClose } = props;
  const [selectedPicture, setSelectedPicture] = useState("1");
  const [selectProfileName, setSelectProfileName] = useState("");
  const [selectProfileNamePath, setSelectProfileNamePath] = useState("");
  const [selectProfileImageSize, setSelectProfileImageSize] = useState("");
  const [uploadImg, setUploadImg] = useState([]);
  const [historyImg, setHistoryImg] = useState([]);
  const [historyImgFile, setHistoryImgFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState();
  const dispatch = useDispatch();
  const { user_profile } = useSelector((state) => ({
    user_profile: state.UserProfile,
  }));
  const device = useSelector((state) => state.CommonConfig.device_type);
  console.log("device===>", device)
  const profilePicture = [
    {
      id: 1,
      name: "Image1",
    },
    {
      id: 2,
      name: "Image2",
    },
    {
      id: 3,
      name: "Image3",
    },
    {
      id: 4,
      name: "Image4",
    },
    {
      id: 5,
      name: "Image5",
    },
    {
      id: 6,
      name: "Image6",
    },
    {
      id: 7,
      name: "Image7",
    },
    {
      id: 8,
      name: "Image8",
    },
    {
      id: 9,
      name: "Image9",
    },
    {
      id: 10,
      name: "Image10",
    },
    {
      id: 11,
      name: historyImg,
    },
  ];

  useEffect(() => {
    setSelectProfileNamePath(user_profile.myAvatarLink);
    if (showMsgSubmit) {
      setShowMsgSubmit(false);
      setTimeout(() => {
        showMessage(
          props.t("your_avatar_submitted_successfully"),
          "SUCCESS",
           `${props.t("message")}`
        );
      }, 1000);
    }
    if (showMsgUpload) {
      setshowMsgUpload(false);
      setTimeout(() => {
        showMessage(
          props.t("your_avatar_uploaded_successfully"),
          "SUCCESS",
           `${props.t("message")}`
        );
      }, 1000);
    }
  }, [user_profile]);

  const handleChooseFile = (e) => {
    if (e.target.files.length) {
      const fileName = e.target.files[0]?.name || "";
      const fileSize = e.target.files[0].size;
      setSelectProfileImageSize(fileSize);
      setSelectProfileName(fileName);
      setUploadImg(e.target.files[0]);
    } else {
      setSelectProfileImageSize("");
      setSelectProfileName("");
      setUploadImg([]);
    }
  };

  const fetchProfilePicture = async () => {
    makeAjax(url.PLAYER_API.getFtpUrl, {}, url.PLAYER_MS_EXT).then(
      (response) => {
        if (response.status !== respStatus["SUCCESS"]) {
          showMessage(response);
          return;
        }
        setProfilePicUrl(response.data);
      }
    );
  };

  const fetchHistoryPicture = () => {
    makeAjax(url.PLAYER_API.getAvatar, {}, url.PLAYER_MS_EXT).then(
      (response) => {
        if (response.status !== respStatus["SUCCESS"]) {
          if (response.code !== "validation_error") {
            showMessage(response);
            return;
          }
          showMessage(response);
          return;
        }
        setHistoryImg(response.data.historyAvatar[0]);
        const historyAvatar = response.data.historyAvatar;
        if (historyAvatar && historyAvatar.length > 0) {
          const historyImgPath = historyAvatar[0];
          const historyImgFileName = historyImgPath.split("/").pop();
          const fileNameWithoutExtension = historyImgFileName.split(".")[0];
          setHistoryImgFile(fileNameWithoutExtension);
          setLoading(false);
        }
      }
    );
  };

  const handlePictureChange = (event) => {
    setSelectedPicture(event.target.value);
  };

  const handleSubmitProfile = async (id) => {
    // const formData = new FormData();
    // formData.append("type", "update_avatar");
    // formData.append("default", id === "11" ? historyImgFile : id);
    const formData ={"type": "update_avatar", "default": id === "11" ? historyImgFile : id}
    makeAjax(url.PLAYER_API.updateAvatar, formData, url.PLAYER_MS_EXT, {
      // header : {
      //     'content-type':"application/json"
      // }
    }).then((response) => {
      if (response.status !== respStatus["SUCCESS"]) {
        showMessage(response);
        return;
      }
      setShowMsgSubmit(true);
      dispatch(getUserProfile());
    });
  };

  const validateImage = (file, size) => {
    if (!file) {
      showMessage(props.t("no_file_chosen"), `${props.t("error")}`,  `${props.t("message")}`);
      return false;
    }
    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
    const maxFileSizeInBytes = 100 * 1024;
    const fileExtension = file.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      showMessage(
        props.t("only_jpg_png_and_gif_files_are_allowed"),
        `${props.t("error")}`,
         `${props.t("message")}`
      );
      return false;
    }
    if (size > maxFileSizeInBytes) {
      showMessage(
        props.t("file_may_not_be_greater_than_100_kb"),
        `${props.t("error")}`,
         `${props.t("message")}`
      );
      return false;
    }
    return true;
  };

  const handleUploadImage = () => {
    if (validateImage(selectProfileName, selectProfileImageSize)) {
      setLoading(true);
      const formData = new FormData();
      formData.append("type", "upload_avatar");
      formData.append("avatar", uploadImg);
  
      makeAjax(url.PLAYER_API.updateAvatar, formData, url.PLAYER_MS_EXT).then(
        (response) => {
          if (response.status !== respStatus["SUCCESS"]) {
            showMessage(response);
            setLoading(false);
            return;
          }
           const uploadedImagePath = `${profilePicUrl}/${response.data.avatar}`;
          setSelectProfileNamePath(uploadedImagePath);
          setLoading(false);
          setshowMsgUpload(true);
          dispatch(getUserProfile());
          fetchHistoryPicture();
          setSelectProfileName("");
        }
      );
    }
  };
  

  useEffect(() => {
    fetchProfilePicture();
    fetchHistoryPicture();
    setSelectedPicture("1")
  }, []);
  return (
    <div className="popup-overlay user">
      <div className="popup-overlay-close" onClick={onClose}></div>
      <div className="popup-content">
        <div className="profile_page">
          <a className="close" onClick={onClose}>
            ×
          </a>
          <h2 className="heading"><img src={usericon} />{props.t("profile")}
            </h2>
          <div className="hr">&nbsp;</div>
          <div className="profile_pg_detail_container">
            <div className="profile_pg_detail">
              <div className="profile_pg_photo">
                {loading ? (
                  <div className="loader-container">
                    <ClipLoader
                      color={"#46117D"}
                      loading={loading}
                      className="override"
                      size={50}
                    />
                  </div>
                ) : (
                  <img src={uploadImg.length ? URL.createObjectURL(uploadImg) : selectProfileNamePath} alt="" />

                )}
              </div>
              <div className="profile_update_holder">
                <div>
                  <label htmlFor="upload_photo" className="upload_photo_detail">
                    <div className="choosefile_btn">
                      {props.t("choose_file")}
                    </div>
                    <div
                      className="upload_photo_link"
                      title={selectProfileName}
                    >
                      {selectProfileName
                        ? selectProfileName.length > 22
                          ? `${selectProfileName.substring(0, 22)}...`
                          : selectProfileName
                        : props.t("no_file_chosen")}
                    </div>
                    <input
                      type="file"
                      id="upload_photo"
                      accept=".jpeg,.jpg,.png,.gif"
                      onChange={handleChooseFile}
                    />
                  </label>
                  <p className="note_text">
                    {props.t("upload_image_jpg_gif_png_max_100kb")}
                  </p>
                </div>
                <button
                  className="btn upload_photo_btn"
                  onClick={handleUploadImage}
                >
                  {props.t("upload")}
                </button>
              </div>
            </div>
            <div className="profile_update_users_list">
              <form>
                <ul>
                  {profilePicture.map((picture, index) => {
                    return (
                      <li key={index}>
                        {picture.id === 11 && !historyImg ? null : (
                          <label htmlFor={`picture-${picture.id}`}>
                            <input
                              id={`picture-${picture.id}`}
                              name="profileImg"
                              type="radio"
                              value={picture.id}
                              onChange={handlePictureChange}
                              checked={selectedPicture === `${picture.id}`}
                            />
                            <div className="profile_update_user_photo">
                              <img
                                src={
                                  picture.id === 11
                                    ? `${profilePicUrl}/${historyImg}`
                                    : `${profilePicUrl}/avatar/${index + 1}.jpg`
                                }
                                alt=""
                                // onError={(e) => { e.target.src = defaultImg; }}
                                style={{ width: "65px" }}
                              />
                            </div>
                          </label>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </form>
              <div className="update_btn_holder">
                <button
                  className="profile_update_btn"
                  onClick={() => handleSubmitProfile(selectedPicture)}
                >
                  {props.t("submit")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default withTranslation()(ProfileModal);
