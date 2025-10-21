import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";

const LogoutMesage = (props) => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(168deg, #0f0f3f 0.33%, #201428 52.3%, #131421 97.77%)',
    color: '#fff'
  };

  const messageStyle = {
    textAlign: 'center'
  };

  useEffect(() => {
    setTimeout(() =>{
      window.close()
    }, 1000)
  })

  return (
    <div style={containerStyle}>
      <div style={messageStyle}>
        <h1>{props.t('you_have_logged_out')}</h1>
        <h4>{props.t('please_close_this_tab_or_window')}</h4>
      </div>
    </div>
  );
};

export default withTranslation()(LogoutMesage);
