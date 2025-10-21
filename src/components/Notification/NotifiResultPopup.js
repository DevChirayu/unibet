 import React, { useEffect, useState } from "react";
// import { withTranslation } from "react-i18next";
import CloseIcon from "../../assets/img/icons/close_icon.svg";
import {
  makeAjax,
  respStatus,
  showMessage,
  url,
} from "../../helpers/global_helper";
import { withTranslation } from "react-i18next";
const NotificationResultPopup = (props) => {
  const {onClose, notificationId, notificationSubject}=props

  const [notificationData, setNotificationData] = useState([]);

  // api for Notification Result Popup
  const fetchNotificationResultData = () => {
    let reqData = {
      notification_id: notificationId,
    };
    makeAjax(url.PLAYER_API.getNotification, reqData, url.PLAYER_MS_EXT).then(
      (response) => {
       
        if (response.status != respStatus["SUCCESS"]) {
          if (response.code != "validation_error") {
            showMessage("server connection lost", 'error', "not getting data");
            return;
          }
          showMessage("server connection lost ", 'error', "not geeting data");
          return;
        }
        setNotificationData(response.data);
      }
    );
  };

  useEffect(() => {
    if (notificationId) {
      fetchNotificationResultData();
    }
  }, [notificationId]);

  return (
    <>
      <div className="notification_sub_popup_overlay"></div>
      <div className="notification_sub_popup">

        <div className="notification_Details">
          <button onClick={onClose}><img src={CloseIcon} alt="" className="btnclose" /></button>
          <h2>{props.t("information")}</h2>
          <div className="notification_body">
            <h3>
              {notificationSubject}
            </h3>
            <p dangerouslySetInnerHTML={{ __html: notificationData }}></p>
        
          </div>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(NotificationResultPopup);
