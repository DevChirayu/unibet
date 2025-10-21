import "./App.css";
import "./Custom.css";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { setCommonConfig, setCurrentStep } from "./redux/actions.js";
import { getDeviceType } from "./helpers/deviceType.js"
import SessionExpireMessage from "./components/Common/SessionExpireMessage.js";
import { makeAjax, url } from "./helpers/global_helper.js";
import LaunchLobby from "./components/LaunchLobby/LaunchLobby.js";
import HomePage from "./components/HomePage.js";
import LogoutMesage from "./components/Common/LogoutMesage.js";
import ServerError from "./components/Common/ServerError.js";
import { withTranslation } from "react-i18next";
import NickName from "./components/NickName/NickName.js";
import Maintenance from "./components/Maintenance/Maintenance.js";
import LobbyContent from "./components/LobbyContent/LobbyContent";
import LoaderImg from "./assets/img/ajax-loader.svg";
import hkbLogo from './assets/img/logo.png'
import wifiIcon from "./assets/img/wifiIcon.png";
import closeIcon from "./assets/img/close.png";

function App(props) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceType, setDeviceType] = useState('')
  const dispatch = useDispatch();
  const [loader, setLoader] = useState('');
  const clientLoader = loader ;
  const loginToken = localStorage.getItem("token")
  const [loginLobby, setLoginLobby] = useState(false)
  const [loginHeader, setLoginHeader] = useState(false)
  const [partnerKey, setPartnerKey] = useState(localStorage.getItem("partner"));
  const [loadingComp, setLoadingComp] = useState(true);
  const FestiveThem = 0;


  const fetchImgData = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.text();
      // Loader Image
      const base64Regex1 = /loading_lobby\s*=\s*"([^"]*)"/;
      const match1 = data.match(base64Regex1);
      if (match1 && match1.length > 1) {
        setLoader(match1[1]);
      } else {
        // console.error('404 Loader Image not found');
      }
      // Logo Image
      // const base64Regex2 = /logo\s*=\s*"([^"]*)"/;
      // const match2 = data.match(base64Regex2);
      // if (match2 && match2.length > 1) {
      //   setLogo(match2[1]);
      // } else {
      //   // console.error('404 Logo Image not found');
      // }
    } catch (error) {
      // console.error('Error fetching the JS file:', error);
    }
  };


  const fetchFtpLogo = async () => {

    const response = await makeAjax(url.PLAYER_API.fetchLoader, [], url.PLAYER_MS_EXT);



    await fetchImgData(response.data.loaderJS);
  }

  useEffect(() => {
    // fetchFtpLogo();
    const deviceType = getDeviceType();
    localStorage.setItem('deviceType', deviceType);
  }, [])

  useEffect(() => {
    const handlePartnerNameChange = () => {
      setPartnerKey(localStorage.getItem("partner"));
    };
    window.addEventListener("partnerNameChange", handlePartnerNameChange);
    return () => {
      window.removeEventListener("partnerNameChange", handlePartnerNameChange);
    };
  }, []);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    let interval;
    if (isLoading) {
      setWidth(0); // Reset width to 0 when loading starts
      interval = setInterval(() => {
        setWidth((prevWidth) => {
          const newWidth = prevWidth + 1;
          if (newWidth >= 100) {
            clearInterval(interval);
          }
          return newWidth;
        });
      }, 100);
    } else {
      setTimeout(() => {

        setWidth(100);

      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && width === 100) {
      setTimeout(() => {

        setLoadingComp(false)
      }, 500);
    }
  }, [width, isLoading])



  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!loginLobby || !loginHeader) {
        setIsLoading(false);
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (loginToken) {
      if (loginLobby && loginHeader) {
        setTimeout(() => {
          setIsLoading(false)
        }, 1500);
      }
    }
  }, [loginLobby, loginToken, loginHeader])


  useEffect(() => {
    if (window.location.pathname == "/logout") {
      setTimeout(() => {
        setIsLoading(false)
      }, 3000);
    }
    if (window.location.pathname == "/sessionexpirelogout") {
      setIsLoading(false)
    }
    if (window.location.pathname == "/nickname") {
      setIsLoading(false)
    }

  }, [window.location.pathname, loginToken])

  const closeOnlinePopup = () => {
    setIsOnline(false)
  }
  useEffect(() => {
    function isDevice() {
      const userAgent = navigator.userAgent;
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );
      const isTablet = /iPad|Android/.test(userAgent) && !isMobile;
      if (isMobile) {
        return "Mobile";
      } else if (isTablet) {
        return "Tablet";
      } else {
        return "Desktop";
      }
    }
    window.isDevice = isDevice;
    const device = window.isDevice();
    setDeviceType(device)
    dispatch(setCommonConfig({ key: "device_type", value: device }));
    return () => {
      delete window.isDevice;
    };
  }, [dispatch]);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const onClose = () => {
    document.getElementById("commonToaster").style.display = "none";
  };
  // .dashboard_search {
  //   padding: 4px 14px !important;
  function isiPhone8() {
    let userAgent;
    let isiphone;
    let height;
    let width;
    userAgent = navigator.userAgent;
    height = window.screen.height;
    width = window.screen.width;
    isiphone = /iPhone/.test(userAgent);
    if (isiphone && height === 667 && width === 375) {
      return true
    } else {
      return false
    }
  }
  if (isiPhone8()) {
    // add iphone8 css
    const dashboardSearch = document.querySelector('.dashboard_search');
    if (dashboardSearch) {
      dashboardSearch.style.display = "flex";
      dashboardSearch.style.gap = "24px";
      // .notification_sub_popup h2
      // dashboardSearch.style.setProperty('padding', '4px 14px', 'important');
    }
  }
  // document.getElementById("commonToasterHeading").text = "Heading";
  // document.getElementById("commonToasterBody").text = "body";


  // const handleCheckNewUser = () => {
  //   makeAjax(url.PLAYER_API.getCoachDetails, {}, url.PLAYER_MS_EXT)
  //     .then((response) => {
  //       if (response.status !== respStatus["SUCCESS"]) {
  //         showMessage(response);
  //         return;
  //       }
  //       if (response.data.value === 0) {
  //         dispatch(setCurrentStep(0))
  //       }
  //       else {
  //         dispatch(setCurrentStep(-1))

  //       }
  //     }).catch((error) => {
  //       console.error("Error fetching CoachMark status:", error);
  //     });
  // }

  // useEffect(() => {
  //   handleCheckNewUser()
  // }, []);
  return (
    <>
      <div id="commonToaster" className="error-popup">
        <div className="error-popup-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <p id="commonToasterHeading" className="message"></p>
          <p id="commonToasterBody" className="error-message"></p>
        </div>
      </div>
      {!loadingComp && (
        <div className="ajax_loader_container hideMe" id="ajax-loader">
          <div className="ajax_loader">
            <img src={LoaderImg} alt="" />
          </div>
        </div>
      )}

      {loadingComp && window.location.pathname !== "/sessionexpirelogout" && window.location.pathname !== "/logout" && (
        <div className="loader-background">
          <div id="ajax-loader" className="custom-loader" >
            <div className="custom-loader-line" style={{ width: `${width}%` }}></div>
            <div className="lds-ripple"></div>
          </div>
        </div>
      )}


      {loadingComp && window.location.pathname !== "/sessionexpirelogout" && window.location.pathname !== "/logout" && (
        <div className="loader-background">
          {
            clientLoader ?
              (
                <div className="loader_img">
                  {clientLoader && (
                    <img
                      src={clientLoader === "h" ? hkbLogo : clientLoader}
                      alt="Client Logo"
                    />
                  )}
                </div>
              ) :
              (<></>)
          }
          <div id="ajax-loader" className="custom-loader">
            <div className="custom-loader-line" style={{ width: `${width}%` }}></div>
            {clientLoader !== '' && (
              <div className="lds-ripple"></div>
            )}
          </div>
          {/* <div className="loader-footer">Copyright © 2016 {partnerKey && partnerKey.toUpperCase()}. All Rights Reserved.</div> */}
           <div className="loader-footer">
            {/* Copyright © {localStorage.getItem("partnerYear")?.toUpperCase()}{" "}
            {partnerKey && partnerKey.toLowerCase() !== "crazyrich88"
              ? localStorage.getItem("partner")?.toUpperCase() + "."
              : ""}
            {" "}All Rights Reserved. */}
            {(localStorage.getItem('partnerFlag') == 1)  &&
              <div className="loader-footer">
                Copyright © {localStorage.getItem('partnerYear')}{" "}
                {localStorage.getItem("partner")?.toUpperCase()}. All Rights Reserved.
              </div>
            }
          </div>
        </div>
      )}

      {!isOnline && (
        <>
          <div className="notification_sub_popup_overlay" ></div>
          <div className="notification_sub_popup">
            <div className="notification_Details conn_lost_detail">
              <button onClick={closeOnlinePopup} className="btnclose"><img src={closeIcon} alt="closeIcon" /></button>
              <div className="conn_lost_inner">
                <img src={wifiIcon} alt="wifi" />
                <h2></h2>
                <div className="notification_body">
                  <h3>
                    Connection Lost
                  </h3>
                  <p>Your connection appears to be off-line.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
        <Router>
          <Routes>
            <Route path="/api/lobby/:token/:operatorid/:username/:channel?" element={<LaunchLobby setLoader={setLoader} />} />
            <Route path="/logout" element={<LogoutMesage />} />
            <Route path="/sessionexpirelogout" element={<SessionExpireMessage />} />
            <Route path="/" element={<HomePage setLoginHeader={setLoginHeader} />} >
              <Route path="game/:game_code" element={<LobbyContent setLoginLobby={setLoginLobby} />} />
              <Route index element={<LobbyContent setLoginLobby={setLoginLobby} />} />
              {/* {mobileToDekstop && <Route path="/information" element={< InformationMoDesign />} />}
          {mobileToDekstop && <Route path="/notification" element={< NotificationMoDesign />} />} */}
            </Route>
            <Route path="*" element={<ServerError />} />
            <Route path="/app/:error_type" element={<ServerError />} />
            <Route path="/nickname" element={<NickName />} />
            <Route path="/maintenance" element={<Maintenance />} />

          </Routes>
        </Router>
    </>
  );
}
export default withTranslation()(App);