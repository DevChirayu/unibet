import { useState, useEffect } from "react";
import { RiMenu2Line } from "react-icons/ri";
import Sidebar from "./Sidebar";
import Slider from "../MainSlider/Slider";
import { FaBell } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import defaultAvatar from "../../assets/images/profile/default.svg";
import { getUserBalance, getUserProfile } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice, showMessage } from "../../helpers/global_helper"
import { withTranslation } from "react-i18next";
import ProfileModal from "../Header/SubComponent/HeaderRightMenu/ProfileModal";
import Notification from "../Notification/Notification";

const Header = (props) => {
  const [searchText, setSearchText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const user_balance = useSelector((state) => state.UserBalance.user_balance);
  const user_profile = useSelector((state) => state.UserProfile);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isProfilePopupOpen, setisProfilePopupOpen] = useState(false);

  const handleProfileClick = () => {
    setisProfilePopupOpen(true);
  };

  const handleCloseProfilePopup = () => {
    setisProfilePopupOpen(false);
  }
  const [showNotification, setShowNotification] = useState(false);


  const handleIconButtonClick = () => {
    setShowNotification(true);
  };

  const handleClose = () => {
    setShowNotification(false);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserBalance());
    dispatch(getUserProfile());
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 786);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Refersh Balance
  const handleRefreshBalance = async () => {
    const currentTime = new Date().getTime();
    const newClickTime = (currentTime - lastClickTime) / 1000;
    if (newClickTime < 8) {
      const remainingTime = Math.ceil(8 - newClickTime);
      let msgName = props.t("try_again_after_8_second");
      const myArray = msgName.split("8");
      showMessage(myArray[0] + remainingTime + myArray[1], "error", "Message");
    } else {
      dispatch(getUserBalance());
      setLastClickTime(currentTime);
    }
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
    }, 2000);
  };

  return (
    <>
      {isMobile ? (
        <>
          <div className="header-container">
            <header className="header">
              <div className="header-left">
                <div className="menu-wrapper">
                  <img
                    src="./assets/images/rect-border.png"
                    className="menu-border"
                  />
                  <img src="./assets/images/Rectangle2.png" className="menu-bg" />
                  <RiMenu2Line
                    className="menu-btn"
                    onClick={() => setIsMenuOpen(true)}
                  />
                </div>
                <img
                  src="./assets/images/canvasgaminglogo2.png"
                  className="logo"
                />
              </div>

              <div className="header-right">
                <div className="coin-balance">
                  <div className="coin-wrapper">
                    <img
                      src="./assets/images/Ellipse1.png"
                      className="coin-border"
                    />
                    <img src="./assets/images/Layer2.png" className="coin-bg" />
                  </div>
                  <div className="balance-amount">
                    <span className="amount">{formatPrice(user_balance.coin)}</span>
                    <FiRefreshCcw onClick={handleRefreshBalance} className={`spin-button ${spinning ? "spin" : ""}`} />
                  </div>
                </div>
                <div className="notify" onClick={() => { handleIconButtonClick() }}>
                  <div className="notifications">
                    <div className="red-dot"></div>
                    <FaBell />
                  </div>
                </div>

                <div>
                  <img
                    src={user_profile.myAvatarLink || defaultAvatar}
                    alt="Profile"
                    className="header-avatar"
                    onClick={handleProfileClick}
                    onError={(e) => {
                    e.target.onerror = null; // prevents looping
                    e.target.src = defaultAvatar; // fallback image
                  }}
                  />
                  <div className="profile-name">
                    <h4 className="title">{user_profile.nickname}</h4>
                  </div>
                </div>
              </div>

            </header>
            <div className="landscape-search">
              <div class="searchBar">
                <button type="submit">
                  <img src="./assets/images/Layer1.png" />
                </button>
                <input
                  type="text"
                  placeholder="Search Here..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>

            <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          </div>
        </>
      ) : (
        <>

          <div className="header-container">
            <header className="header">
              <div className="header-left">
                <button class="deposit-bonus-btn">
                  <img src="./assets/images/gift-box.png" className="gift-img" />
                  <span>Deposit Bonus</span>
                </button>
              </div>
              <div className="right-side-header">
                <div>
                  <div class="searchBar">
                    <button id="searchQuerySubmit" type="submit">
                      <img src="./assets/images/Layer1.png" />
                    </button>
                    <input
                      type="text"
                      placeholder="Search Here..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />

                  </div>
                </div>

                <div className="coin-balance">
                  <div className="coin-wrapper">
                    <img
                      src="./assets/images/Ellipse1.png"
                      className="coin-border"
                    />
                    <img src="./assets/images/Layer2.png" className="coin-bg" />
                  </div>
                  <div className="balance-amount">
                    <span className="amount">{formatPrice(user_balance.coin)}</span>
                    <FiRefreshCcw onClick={handleRefreshBalance} className={`spin-button ${spinning ? "spin" : ""}`} />
                  </div>
                </div>
                <div className="notify" onClick={() => { handleIconButtonClick() }}>
                  <div className="notifications">
                    <div className="red-dot"></div>
                    <FaBell />
                  </div>
                </div>
                <img
                  src={user_profile.myAvatarLink || defaultAvatar}
                  alt="Profile"
                  className="header-avatar"
                  onClick={handleProfileClick}
                  onError={(e) => {
                    e.target.onerror = null; // prevents looping
                    e.target.src = defaultAvatar; // fallback image
                  }}
                />
                <div className="online-user"></div>
                <div className="profile-name">
                  <div className="user">
                    <h4 className="title">{user_profile.nickname}</h4>
                    <div className="online-user-desktop"></div>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </>
      )}
      <Slider searchText={searchText} />

      {isProfilePopupOpen && (
        <ProfileModal onClose={handleCloseProfilePopup} />
      )}
      {showNotification && (
        <Notification onClose={handleClose} />
      )}
    </>
  );
};

export default withTranslation()(Header);
