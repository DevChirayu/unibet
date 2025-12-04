import React from "react";
import hkbLogo from "../../assets/img/logo.png";

function LoadingComponent({ loadingComp, width, clientLoader, partnerKey }) {
  if (
    !loadingComp ||
    window.location.pathname === "/sessionexpirelogout" ||
    window.location.pathname === "/logout"
  ) {
    return null;
  }

  return (
    <div className="loader-background">
         <h1>HELLO</h1>
      {clientLoader ? (
        <div className="loader_img">
          {clientLoader && (
            <img
              src={clientLoader === "h" ? hkbLogo : clientLoader}
              alt="Client Logo"
            />
          )}
        </div>
      ) : (
        <></>
      )}
      <div id="ajax-loader" className="custom-loader"> 
        <div className="custom-loader-line" style={{ width: `${width}%` }}></div>
        {clientLoader !== "" && <div className="lds-ripple"></div>}
      </div>
      <div className="loader-footer">
        {localStorage.getItem("partnerFlag") === "1" && (
          <div className="loader-footer">
            Copyright © {localStorage.getItem("partnerYear")}{" "}
            {localStorage.getItem("partner")?.toUpperCase()}. All Rights
            Reserved.
          </div>
        )}
      </div>
    </div>
  );
}

export default LoadingComponent;
