import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { makeAjax, respStatus, showMessage, url } from "../../helpers/global_helper";
import { TOKEN_KEY } from "../../helpers/url_helper";
import { useDispatch } from "react-redux";
import { getGlobalConfig, setCommonConfig } from "../../redux/actions";
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { ClientJS } from 'clientjs';
import { getClientJSData } from "../../helpers/clientInfo";

const LaunchLobby = (props) => {

  const fptoolkit = process.env.REACT_APP_FPTOOLKIT || "free";
  const hasRuncd = useRef(false);
  const [fpHash, setFpHash] = useState(null);
  const [clientJsFingerPrint, setClientJsFingerPrint] = useState(null);
  const [clientData, setClientData] = useState(null);
  const client = new ClientJS();

  const generateClientJSFingerprint = () => {
    try {
      const clientfingerprint = client.getFingerprint();
      localStorage.setItem('clientJsFingerPrint', clientfingerprint);
      setClientJsFingerPrint(clientfingerprint);
    } catch (error) {
      console.error('[LaunchLobby] Failed to generate clientJS_FP:', error);
    }
  };

  const getHash = (fingerprint, clientjs) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint + clientjs);
    return crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
      console.log('Hash:', hash);
      return hash;
    });
  };

  useEffect(() => {
    const setFp = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      setFpHash({ "visitorId": visitorId });
    };
    setFp();
    generateClientJSFingerprint();
  }, []);

  const [imageLogo, setImageLogo] = useState(null);
  const [imageLoader, setImageLoader] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  let storedFPJS = localStorage.getItem('fpjs');
  const [fpjs, setFPJS] = useState({
    requestId: "",
    visitorId: "",
    deviceBrowser: "",
  });


  const { token, operatorid, username, channel } = useParams();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    if (imageLoader) {
      localStorage.setItem('loader', imageLoader);
      localStorage.setItem('logo', imageLogo);
      props.setLoader(imageLoader);
    }
  }, [imageLoader]);

  const checkDevice = async () => {
    try {
      let clientjs = localStorage.getItem('clientJsFingerPrint');     
      if(!clientjs) {
        await generateClientJSFingerprint();
        clientjs = localStorage.getItem('clientJsFingerPrint');
      }      
      if (!storedFPJS || !clientjs) {
        console.warn('Missing required data: storedFPJS or clientjs');
        return;
      }

      const fp = JSON.parse(storedFPJS);
      const fingerprint = fp.visitorId;

      const clientData = await getClientJSData(client);
      const hashedFingerprint = await getHash(fingerprint, clientjs);
      const deviceBrowser = `${clientData.getBrowser} ${clientData.getOS}`;
      const reqData = { visitorId: hashedFingerprint, clientData: clientData, deviceBrowser: deviceBrowser };

      const response = await makeAjax(url.PLAYER_API.checkDevice, reqData, url.PLAYER_MS_EXT);
      if (response.status === respStatus['SUCCESS']) {
        hasRuncd.current = true;
      } else if (response.status === respStatus['ERROR']) {
        console.error('Error in checkDevice:', response);
      }
    }
    catch (error) {
      console.error('Error in checkDevice:', error);
    };
  };


  const getMyToken = async (event) => {
    let reqData = {
      token: token,
      operatorid: operatorid,
      user_name: username,
      channel: channel
    };
    localStorage.clear();
    // if (
    //   localStorage.getItem("partner_token")
    //   && localStorage.getItem("partner_token") == token
    //   && username == localStorage.getItem('partner_username')
    //   && localStorage.getItem(url.TOKEN_KEY)
    // ) {
    //   const balanceResp = await makeAjax(url.PLAYER_API.verifyLogin, {}, url.PLAYER_MS_EXT);
    //   if (balanceResp.status == respStatus['SUCCESS']) {
    //     navigate('/');
    //     return;
    //   }
    // }

    const response = await makeAjax(url.PLAYER_API.addUserSession, reqData, url.PLAYER_MS_EXT);
    if (response.status !== respStatus['SUCCESS']) {
      if (response.code === "lobby_maintenance" || response.code === "inactive_partner") {
        navigate('/maintenance');
        return;
      }
      if (response.code === "invalid_player_of_partner") {
        navigate('/sessionexpirelogout');
        return;
      }
      showMessage(response);
      return;
    }
    await fetchData(response.data.loaderJS);
    localStorage.setItem(TOKEN_KEY, response.data.token);
    localStorage.setItem("partner", response.data.partner);
    localStorage.setItem('user_name', username);
    localStorage.setItem('partner_token', token);
    localStorage.setItem('partner_username', username);
    localStorage.setItem('partnerYear', response.data.partnerYear);
    localStorage.setItem('partnerFlag', response.data.partnerFlag);
    localStorage.setItem('user_id', response.data.userId);
    localStorage.setItem('PromoDirection', 0);

    setUserName(response.data.userName);
    console.log("response.data===>>>", response.data)
    setUserId(response.data.userId);
    dispatch(getGlobalConfig());
    dispatch(setCommonConfig({ key: 'promoStatus', value: 1 }))
    const partnerNameChangeEvent = new Event("partnerNameChange");
    window.dispatchEvent(partnerNameChangeEvent);
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };




  const fetchData = async (url) => {
    const response = await fetch(url);
    const data = await response.text();
    //Loader Image
    const base64Regex1 = /loading_lobby\s*=\s*"([^"]*)"/;
    const match1 = data.match(base64Regex1);
    if (match1 && match1.length > 1) {
      setImageLoader(match1[1]);
    } else {
      console.error('404 Loader Image');
    }
    //Logo Image
    const base64Regex2 = /logo\s*=\s*"([^"]*)"/;
    const match2 = data.match(base64Regex2);

    if (match2 && match2.length > 1) {
      setImageLogo(match2[1]);
    } else {
      console.error('404 Logo Image');
    }
  }

  const { isLoading, error, data, getData } = useVisitorData(
    { extendedResult: true },
    { immediate: false }
  );

  useEffect(() => {
    const { requestId, visitorId, browserName, os, osVersion } = data || {};
    const concatenatedValue = `${browserName || ""} ${os || ""} ${osVersion || ""}`;
    setFPJS({
      requestId: requestId || "",
      visitorId: visitorId || "",
      deviceBrowser: concatenatedValue.trim(),
    });
  }, [data]);

  useEffect(() => {
    if (fptoolkit == "paid") {
      if (fpjs.requestId) {
        localStorage.setItem("fpjs", JSON.stringify(fpjs));
        storedFPJS = localStorage.getItem('fpjs');
        setTimeout(() => {
          checkDevice();
        }, 7000);
      }
    }
  }, [fpjs]);

  useEffect(() => {
    if (!hasRuncd.current && fpHash && userId && userName) {
      localStorage.setItem("fpjs", JSON.stringify(fpHash));
      storedFPJS = localStorage.getItem('fpjs');
      setTimeout(() => {
        hasRuncd.current = true;
        checkDevice();
      }, 7000);
    }
  }, [fpHash, userId, userName]);


  useEffect(() => {
    if (fptoolkit == "paid") {
      if (!storedFPJS) {
        if (userId && userName) {
          console.debug("Triggering getData...");
          getData({
            linkedId: userId,
            tag: {
              env: "199",
              username: userName,
            }
          });
        }
      }
    }
  }, [userId, username]);

  useEffect(() => {
    localStorage.removeItem(TOKEN_KEY);
    getMyToken();
    if (!hasRuncd.current && storedFPJS) {
      hasRuncd.current = true;
      setTimeout(() => {
        checkDevice();
      }, 7000);
    }
  }, [token, operatorid, username, channel]);


  return (
    <>
    </>
  );
}
export default LaunchLobby;
