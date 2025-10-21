import React, { useEffect } from "react";
import { withTranslation } from "react-i18next";
import InfoIcon from "../../assets/img/icons/information_sessionexpire.svg";
const SessionExpireMessage = () => {

  useEffect(() => {
    setTimeout(() =>{
      if (/\.apk$/.test(window.location.href)) {
        window.location.href = document.referrer;
      } else {
        window.close();
      }
    }, 3000)
  })
  return (
    <div class="msg-container">
    <div class="message">
      <h1>
        <img src={InfoIcon} alt="" class="info-icon"/>
        INFORMATION
      </h1>
      <h2>
        ANDA TELAH LOGIN MELALUI DEVICE LAIN. SEGERA HUBUNGI <br></br>
        ADMINISTRATOR KAMI!!!
      </h2>
      <h4>
        Silakan hubungi Customer Service Kami Melalui Via Livechat atau Memo.<br></br>
      
        Terima Kasih
      </h4>
    </div>
  </div>
  );
};

export default withTranslation()(SessionExpireMessage);
