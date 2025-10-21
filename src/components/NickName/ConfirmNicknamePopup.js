import React from "react";
import InnerPopup from "../Modal/InnerPopup";

const ConfirmNicknamePopup = ({ nickname, onClose, onUpdate }) => {
  return (
    <div className="nickname_modal">
      <InnerPopup onCloseModal={onClose}>
        <div className="nickname_poupcontent">
          <p>
          Apakah anda yakin menggunakan nickname <br />
            "{nickname}" ?
          </p>
          <div className="nickname_poupcontent_btns">
          <button className="btn" onClick={onClose}>
              Batal
            </button>
            <button className="btn" onClick={onUpdate}>
                Konfirmasi
             </button>
          
          </div>
        </div>
      </InnerPopup>
    </div>
  );
};

export default ConfirmNicknamePopup;
