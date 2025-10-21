import React from "react";
import InnerPopup from "../Modal/InnerPopup";


const NicknameSuccessPopup = ({ onClose }) => {

  return (
    <div className="nickname_modal">
      <InnerPopup onCloseModal={onClose} closeButton={false}>
        <div className="nickname_content_box">
          <div className="success_message" >
            <p>
            NICKNAME ANDA BERHASIL TERDAFTAR!
            </p>
          </div >
        </div >
      </InnerPopup >
    </div >
  );
};

export default NicknameSuccessPopup;
