import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const ServerError = (props) => {


  const { error_type } = useParams();
  const [error, setError] = useState('404');
  useEffect(() => {
    if (error_type) {
      setError(error_type);
      return;
    }
    setError('404');
  }, [error_type]);

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

  return (
    <div style={containerStyle}>
      <div style={messageStyle}>
        <h1>{props.t(error + "_header")}</h1>
        <h4>{props.t(error + "_message")}</h4>
      </div>
    </div>
  );
};

export default withTranslation()(ServerError);
