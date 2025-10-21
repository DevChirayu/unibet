import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import {
  makeAjax,
  respStatus,
  showMessage,
  url,
} from "../../helpers/global_helper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ConfirmNicknamePopup from "./ConfirmNicknamePopup";
import NicknameSuccessPopup from "./NicknameSuccessPopup";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { getUserProfile } from "../../redux/actions";
import InnerPopup from "../Modal/InnerPopup";
const NickName = () => {
  const [nickname, setNickname] = useState("");
  const [genratenickname, setGenrateNicknameData] = useState([]);
  const [selectedNickname, setSelectedNickname] = useState(false);
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
  const [selectedProfileIcon, setSelectedProfileIcon] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState([]);
  const [uploadImage, SetUploadedImage] = useState('');
  const [error, setError] = useState("");
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [isRefreshing, setISRefreshing] = useState(false);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(null);
  const [selectedIconId, setSelectedIconId] = useState(null);
  const [uploadimgpopup, setUploadimgpopup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const[newImageUrl,setNewImageUrl]=useState('');

  const sliderSettings = {
    dots: false,
    infinite: true,
    centerPadding: "0px",
    speed: 100,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    focusOnSelect: true,
    afterChange: (currentSlide) => {
      // const selectedImage = profilePicture[currentSlide]?.name;
      const selectedId = profilePicture[currentSlide]?.id;
      if (selectedId === 100) {
        setSelectedProfileIcon(1);
      } else {
        setSelectedProfileIcon(selectedId); 
      }
    },
  };
  // Username Remove TTJ
  const user_profile = useSelector(state => state.UserProfile);
  const username = user_profile.user_name;
  let modifiedUsername = '';
  if (username) {
    modifiedUsername = username.split('_')[1];    
  }

  // Nickname Validations
  const handleInputChange = (event) => {
    const input = event.target.value.toUpperCase().slice(0, 9);
    const filteredInput = input.replace(/[^a-zA-Z0-9]/g, "");
    setNickname(filteredInput);
    const trimmedNickname = filteredInput.trim();
    setError("");
    if (trimmedNickname.length === 0) {
      setError("");
      setIsConfirmEnabled(false);
    } else if (trimmedNickname.length < 2) {
      setError("Diperlukan minimal 2 karakter alfanumerik");
      setIsConfirmEnabled(false);
    } else if (trimmedNickname.length > 9) {
      setIsConfirmEnabled(false);
    } else if (
      !(/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(trimmedNickname))
    ) {
      setError("Diperlukan minimal 2 karakter alfanumerik");
      setIsConfirmEnabled(false);
    } else if (trimmedNickname === modifiedUsername) {
      setError("Nickname harus berbeda dengan Username");
      setIsConfirmEnabled(false);
    } else {
      if (selectedNickname) {
        document.getElementById("ownnickname").checked = true;
        setSelectedNickname(false);
      }
      else {
        setIsConfirmEnabled(true); 
        checkNicknameExists(trimmedNickname);
      }
    }

  };
  // Continue Btn
  const handleContinue = (event) => {
    event.preventDefault();
    const trimmedNickname = nickname.trim();
    if (trimmedNickname.length < 2) {
      setError("Diperlukan minimal 2 karakter alfanumerik");
      setIsConfirmEnabled(false);
    } else if (trimmedNickname.length > 9) {
      setIsConfirmEnabled(false);
    } else if (
      !/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(trimmedNickname)
    ) {
      setError("Diperlukan minimal 2 karakter alfanumerik");
      setIsConfirmEnabled(false);
    } else if (trimmedNickname === modifiedUsername) {
      setError("Nickname harus berbeda dengan Username");
      setIsConfirmEnabled(false);
    } else {
      
      setShowConfirmationPopup(true);
    }
  };
  // profilePicture avatars in slider
  const profilePicture = [
    {
      id: 1,
      name: "Image1",
    },
    {
      id: 100,
      name: "Image",
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
  ];
  // avatar select
  const handleProfileSelect = (event) => {
    const selectedIconId = event.target.id;
    setSelectedProfileIcon(parseInt(selectedIconId));
    setSelectedProfileIndex(parseInt(selectedIconId));
  };

  const closeUploadimgpoppu = () => {
    setUploadimgpopup(false)
  }

  // To Upload new profile Image
  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    if (validateImage(imageFile, imageFile.size)) {
      const formData = new FormData();
      formData.append("type", "upload_avatar");
      formData.append("avatar", imageFile);
      SetUploadedImage(formData);
      setSelectedProfileIcon("upload");
      onChangeUpdateProfileImage(formData);
      setUploadimgpopup(true);
    }
  };

  // Api for update/upload profile Image
  const onChangeUpdateProfileImage = (reqData) => {
    if (selectedProfileIcon === "upload") {
      const imageFormData = uploadImage;
      for (const [key, value] of imageFormData.entries()) {
        reqData.append(key, value);
      }
    }
    makeAjax(url.PLAYER_API.updateAvatar, reqData, url.PLAYER_MS_EXT)
      .then((response) => {
        if (response.status === respStatus["SUCCESS"]) {
          setNewImageUrl(response.data)
          localStorage.setItem("avatarimage",response.data)
        }
      })
      .catch((error) => {
        showMessage("server error", "error", "error");
      });
  };

  // validation for upload image
  const validateImage = (file, size) => {
    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
    const maxFileSizeInBytes = 100 * 1024;
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      showMessage(
        "Gambar harus dalam bentuk jpeg, png, jpg, gif.",
        "error",
        "Message"
      );
      return false;
    }
    if (size > maxFileSizeInBytes) {
      showMessage("Gambar tidak boleh lebih dari 100 kilobytes.", "error", "Message");
      return false;
    }
    return true;
  };

  // Api for update/upload profile Image
  const updateProfileImage = () => {
    let reqData = new FormData();
    reqData.append("type", "update_avatar");
    reqData.append("default", selectedProfileIcon !== null ? selectedProfileIcon : (selectedIconId !== null ? selectedIconId : 1));
    if (selectedProfileIcon === "upload") {
      reqData.delete("default");
      const imageFormData = uploadImage;
      for (const [key, value] of imageFormData.entries()) {
        reqData.append(key, value);
      }
    }
    makeAjax(url.PLAYER_API.updateAvatar, reqData, url.PLAYER_MS_EXT)
      .then((response) => {
        if (response.status === respStatus["SUCCESS"]) {
          setShowConfirmationPopup(false);
          setSuccessPopup(true);
        }
      })
      .catch((error) => {
        showMessage("server error", "error", "error");
      });
  };
  const handleRadioChange = () => {
    setSelectedNickname(false);
    setNickname("");
    setIsConfirmEnabled(false);
  };


  // Genrated nickname selections
  const handleNicknameSelection = (selectedNickname) => {
    setNickname(selectedNickname);
    setSelectedNickname(selectedNickname);
    setIsConfirmEnabled(true);
    setError("");
  };
  // Refersh gerated nickname
  const handleRefreshClick = () => {
    setISRefreshing(true);
    setTimeout(() => {
      setISRefreshing(false);
    }, 500);
    fetchGenrateNicknameData();
  };

  // api for default avatar in slider
  const fetchProfilePicture = async () => {
    makeAjax(url.PLAYER_API.getFtpUrl, {}, url.PLAYER_MS_EXT).then((response) => {
      if (response.status !== respStatus["SUCCESS"]) {
        if (response.code !== "validation_error") {
          showMessage("server error", "error", "error");
          return;
        }
        showMessage("server error", "error", "error");
        return;
      }
      setProfilePicUrl(response.data);
    });
  };
  // api for genrate nickname
  const fetchGenrateNicknameData = () => {
    makeAjax(url.PLAYER_API.generateNickname, {}, url.PLAYER_MS_EXT).then((response) => {
      if (response.status !== respStatus["SUCCESS"]) {
        showMessage("Server error: No data found", "error", "error");
        return;
      }
      setGenrateNicknameData(response.data);
    });
  };
  // api for check existing nickname
  const checkNicknameExists = (nickname) => {
    let reqData = {
      nickname: nickname,
    };
    makeAjax(url.PLAYER_API.checkNickname, reqData, url.PLAYER_MS_EXT)
      .then((response) => {
        if (response.status === respStatus["SUCCESS"]) {
          if (response.data === true) {
            setError("Nickname telah terdaftar");
            setIsConfirmEnabled(false);
          } 
        }
      })
      .catch((error) => {
        showMessage("server error", "error", "error");
      });
  };
  // api for update nickname
  const updateMyNickname = () => {
    let reqData = {
      nickname: selectedNickname ? selectedNickname : nickname,
    };
    makeAjax(url.PLAYER_API.updateNickname, reqData, url.PLAYER_MS_EXT)
      .then((response) => {
        if (response.status === respStatus["SUCCESS"]) {
          updateProfileImage();
          setShowConfirmationPopup(false);
          setSuccessPopup(true);
        }
      })
      .catch((error) => {
        showMessage("server error", "error", "error");
      });
  };

  useEffect(() => {
    fetchGenrateNicknameData();
    fetchProfilePicture();
    dispatch(getUserProfile());
    localStorage.getItem('avatarimage')
  }, []);

  useEffect(() => {
    if (successPopup) {
      const timer = setTimeout(() => {
        setSuccessPopup(false);
        localStorage.removeItem("avatarimage");
        window.history.replaceState(null, "", "/");
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successPopup, navigate]);

  return (
    <>
      <div className="nickname_wrapper">
        <div className="nickname_container">
          <div className="nickname_header">
            <p className="nickname_title">SELAMAT DATANG, {modifiedUsername}</p>
          </div>
          <div className="nickname_content_box">
            <p className="nickname_heading">
              Silakan Pilih  <span>Avatar</span> dan Isi <span>Nickname</span> Game Anda:
            </p>
            <div className="avatar_slider">
              <div style={{ width: "100%", maxWidth: 600 }}>
                <Slider {...sliderSettings}>
                  {profilePicture.map((avatar, index) => (
                    <div className="avatar" key={index}>
                      {index === 1 ? (
                        <button
                          onClick={() =>
                            document.getElementById("uploadInput")?.click()
                          }
                          className="avatar_change_btn"
                        >
                          Change
                        </button>
                      ) : null}
                      {index === 1 ? (
                        <div className="avatar-image-container">
                          {
                            uploadImage ? (<>
                              <img
                                src={URL.createObjectURL(uploadImage.get("avatar"))}
                                className="background-image"
                                alt=""
                              />
                            </>
                            ) : (
                              <img
                                src={( localStorage.getItem('avatarimage'))?localStorage.getItem('avatarimage'):`${profilePicUrl}/avatar/blank.jpg`}
                                alt=""
                              />
                            )
                          }
                        </div>
                      ) : (
                        <>
                          {avatar ? (
                            <img
                              src={`${profilePicUrl}/avatar/${index === 0 ? 1 : index
                                }.jpg`}
                              id={avatar.id}
                              onClick={handleProfileSelect}
                              className={`avatar ${index === selectedProfileIndex
                                ? "centered-avatar"
                                : ""
                                }`}
                            />
                          ) : (
                            <div className="avatar_empty">
                              <img
                                src={`${profilePicUrl}/avatar/blank.jpg`}
                                alt=""
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </Slider>
              </div>
              <input
                id="uploadInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </div>
            <div className="nickname_content">
              <form>
                <div className="nickname_row">
                  <div className="nickname_radio_box">
                    <input
                      type="radio"
                      id="ownnickname"
                      checked={selectedNickname === false}
                      onChange={handleRadioChange}
                      name="avatar"
                    />
                    <label htmlFor="ownnickname">
                      Silakan Tambahkan Nickname anda
                    </label>
                  </div>
                </div>
                <div className="nickname_row">
                  <div className="nickname_box2">
                    <input
                      type="text"
                      value={nickname}
                      onChange={handleInputChange}
                    />
                    <button
                      onClick={handleContinue}
                      className={`button ${!isConfirmEnabled ? "disabled" : "enabled"}`}
                    >
                      LANJUTKAN
                    </button>
                  </div>
                  <span className="error_message">{error}</span>
                </div>
                <div className="nickname_row">
                  <div className="nickname_box2">
                    <p>Nickname Suggestions</p>{" "}
                    <div className="avatar_refresh_btn">
                      {/* <img
                        src={RefreshBtn}
                        alt=""
                        className={`refreshIcon ${isRefreshing ? "refreshingIcon" : ""
                          }`}
                        onClick={handleRefreshClick}
                      /> */}
                    </div>
                  </div>
                </div>
                <div className="nickname_row2">
                  {genratenickname.map((item, index) => (
                    <div className="nickname_radio_box" key={index}>
                      <input
                        type="radio"
                        id={`ownnickname_${index}`}
                        name="avatar"
                        value={item}
                        checked={selectedNickname === item}
                        onChange={() => handleNicknameSelection(item)}
                      />
                      <label htmlFor={`ownnickname_${index}`}>{item}</label>
                    </div>
                  ))}
                </div>
              </form>
              <ul className="nickname_note">
                <li>Minimal 2 karakter dan Maksimal 9 karakter. </li>
                <li>Hanya berlaku 1(satu) kali saja & tidak dapat diganti lagi.</li>
                <li>Nickname wajib menggunakan huruf dan angka.</li>
                <li>Spesial karakter dan spasi tidak diperbolehkan.</li>
                <li>Player dapat menekan tombol reload untuk nickname suggestion yang lain.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showConfirmationPopup && (
        <ConfirmNicknamePopup
          nickname={nickname}
          onClose={() => setShowConfirmationPopup(false)}
          onUpdate={updateMyNickname}
        />
      )}
      {successPopup && (
        <NicknameSuccessPopup
          onClose={() => setSuccessPopup(false)}
        />
      )}
      {/* upload image success popup */}
      {uploadimgpopup && (
        <div className="nickname_modal">
          <InnerPopup onCloseModal={closeUploadimgpoppu} modalHeader={true} modalTitle="Message">
            <div className="nick_success_message">
              <p>
                Success upload avatar!
              </p>
            </div>
          </InnerPopup >
        </div >
      )}
    </>
  );
};

export default withTranslation()(NickName);
