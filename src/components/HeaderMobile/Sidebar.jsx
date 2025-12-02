import { useState } from "react";
import { FaRegListAlt } from "react-icons/fa";
import { MdLogout, MdClose } from "react-icons/md";
import { TbCrystalBall, TbCards } from "react-icons/tb";
import { BsGlobe } from "react-icons/bs";
import { GiEightBall } from "react-icons/gi";
import InnerPopup from "../Modal/InnerPopup";
import {
  makeAjax,
  respStatus,
  showMessage,
  url,
} from "../../helpers/global_helper";
import { TOKEN_KEY } from "../../helpers/url_helper";
import { withTranslation } from "react-i18next";
import InformationMobilePopup from "../Information/InformationMobilePopup";
import i18next from 'i18next';

const Sidebar = (props) => {
  const { isOpen, onClose } = props;
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [popup, setPopup] = useState(null);

  const closeUploadimgpoppup = () => {
    setPopup(false);
  };

  const updateUserLanguage = (lang) => {
    let reqData = {
      lang: lang
    };
    makeAjax(url.PLAYER_API.updateUserLanguage, reqData, url.PLAYER_MS_EXT)
      .then(response => {
        if (response.status !== respStatus['SUCCESS']) {
          showMessage(response);
          return;
        }
        localStorage.setItem("I18N_LANGUAGE", lang);
        i18next.changeLanguage(lang);
        setShowSubmenu(false);
      });
  }

  const handleLogout = () => {
    setPopup(
      <div className="logout_modal">
        <InnerPopup
          onCloseModal={closeUploadimgpoppup}
          modalHeader={true}
          modalTitle="Message"
        >
          <div className="nick_success_message">
            <p> {props.t("you_ve_been_logged_out_successfully")}</p>
          </div>
        </InnerPopup>
      </div>
    );
    makeAjax(url.PLAYER_API.logout, {}, url.PLAYER_MS_EXT).then((response) => {
      if (response.status === respStatus["SUCCESS"]) {
        showMessage(response);
        localStorage.removeItem(TOKEN_KEY);
      }
    });
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // const handleTransactionClick = () => {
  //   setIsPopupOpen(true);
  //   onClose(false);
  // };

  const redirectLobby = (lobbyValue) => {
    let gameType = '';
    if (lobbyValue == 'togel') {
      gameType = 5;
    } else if (lobbyValue == 'cardgame') {
      gameType = 3;
    } else if (lobbyValue == 'dingdong') {
      gameType = 2;
    }
    makeAjax(url.PLAYER_API.redirectLobby, { "gameType": gameType }, url.PLAYER_MS_EXT).then((response) => {
      if (response.status !== respStatus["SUCCESS"]) {
        showMessage(response);
        return;
      }
      handleLogout();
      localStorage.clear();
      window.location.href = response.data.link;
    })
  }

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => onClose(false)}>
          <MdClose />
        </button>
        <div className="sidebar-header">
          <img
            src="./assets/images/sidebar-logo.png"
            className="sidebar-logo"
          />
        </div>
        <ul>
          <li className="menu-list" onClick={() => redirectLobby('dingdong')}>
            <TbCrystalBall />
            <span>Dingdong</span>
          </li>
          <li className="menu-list" onClick={() => redirectLobby('cardgame')}>
            <TbCards />
            <span>Card Games</span>
          </li>
          <li className="menu-list" onClick={() => redirectLobby('togel')}>
            <GiEightBall />
            <span>Lottery</span>
          </li>
          <li className="menu-list"
            onClick={handleTransactionClick}
          >
            <FaRegListAlt />
            <span>{props.t('transaction')}</span>
          </li>
          <li
            className="menu-list"
            onClick={() => setShowSubmenu(!showSubmenu)}
          >
            <BsGlobe />
            <span>{props.t("language")}</span>
          </li>
          {showSubmenu && (
            <ul className="submenu">
              <li className="lang-list" onClick={() => updateUserLanguage('en')} >
                <img src="./assets/images/english.png" />
                <span>English</span>
              </li>
              <li className="lang-list" onClick={() => updateUserLanguage('id')} >
                <img src="./assets/images/indonesia.png" />
                <span>Indonesia</span>
              </li>
            </ul>
          )}
          <hr />
          <li className="menu-list" onClick={() => handleLogout()}>
            <MdLogout />
            <span>{props.t("logout")}</span>
          </li>
        </ul>
      </div>
      {isOpen && <div className="overlay" onClick={onClose}></div>}

      {isPopupOpen && (
        <InformationMobilePopup onClose={() => setIsPopupOpen(false)} />
      )}
    </>
  );
};

export default withTranslation()(Sidebar);
