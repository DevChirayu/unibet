import axios from "axios";
import * as url from "./url_helper";
let tokenPrefix = "Bearer ";

if (custom_loader_count === undefined) var custom_loader_count = 0;

export const respStatus = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  NOT_AUTHORISED: "You are not authorised.",
};

// Register Method
const base_url = window.location.origin;
const axiosApi = axios.create({
  baseURL:
    process.env.REACT_APP_ENABLE_LOCAL_API == 1
      ? process.env.REACT_APP_API_URL
      : base_url,
});

axiosApi.interceptors.request.use((config) => {
  let common_request_data = {
    [url.LOBBY_KEY]: process.env.REACT_APP_LOBBY,
    [url.LOBBY_MOB_PERM]: 'new_ar_lob_mob_status',
    [url.LOBBY_WEB_PERM]: 'new_ar_lob_web_status',
    [url.LOBBY_VERSION_KEY]: process.env.REACT_APP_LOBBY_VERSION
  };
  console.log('axiosApi.interceptors.request', common_request_data);
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      common_request_data: common_request_data,
    };
  } else {
    if (config.data instanceof Array) {
      config.data = {
        data: config.data,
        common_request_data: common_request_data,
      };
    } else if (config.data == null) {
      config.data = {
        common_request_data: common_request_data,
      };
    } else {
      config.data = {
        ...config.data,
        common_request_data: common_request_data,
      };
    }
  }

  return config;
}, (error) => {
  console.error('axiosApi.interceptors.request', error);
  return Promise.reject(error);
});

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

const userAgent = navigator.userAgent.toLowerCase();
const isMobile = /android|iphone|ipad|ipod/i.test(userAgent);
const isWebView = userAgent.includes('wv');

const handelLogout = () => {
  if (isMobile) {
    if (isWebView) {
      console.log("isWebView", document.referrer);
      window.location.href = document.referrer;
    } else {
      console.log("isMobile");
      window.close();
    }
  } else {
    console.log("isDesktop");
    window.close();
  }
};


const makeAjax = (
  extension,
  data,
  micro_service = url.ARCADE_MS_EXT,
  header = {}
) => {
  if (extension === url.PLAYER_API.addUserSession) {
    localStorage.removeItem(url.TOKEN_KEY);
  }

  startLoader(extension);
  let token = tokenPrefix + localStorage.getItem(url.TOKEN_KEY);


  let APPLICATION_EXT = url.APPLICATION_EXT;

  if (micro_service == url.ARCADE_MS_EXT) {
    APPLICATION_EXT = "/user-api";
    axiosApi.defaults.baseURL = process.env.REACT_APP_ARCADE_API_URL
  }
  else {
    axiosApi.defaults.baseURL = process.env.REACT_APP_ENABLE_LOCAL_API == 1
      ? process.env.REACT_APP_API_URL
      : base_url
  }

  axiosApi.defaults.headers.common["Authorization"] = token;

  let end_url =
    url.API_PREFIX + micro_service + APPLICATION_EXT + extension;
  if (process.env.REACT_APP_ENABLE_LOCAL_API == 2) {
    end_url = micro_service + APPLICATION_EXT + extension;
  }
  if (process.env.REACT_APP_LOCAL_EXCEPTION) {
    let exceptional_ms = process.env.REACT_APP_LOCAL_EXCEPTION.split(",");
    if (exceptional_ms.includes(micro_service)) {
      axiosApi.defaults.baseURL = 'http://127.0.0.1';
      end_url = url.API_PREFIX + micro_service + url.APPLICATION_EXT + extension;
    } else {
      axiosApi.defaults.baseURL = (process.env.REACT_APP_ENABLE_LOCAL_API == 1) ? process.env.REACT_APP_API_URL : base_url;
    }
  }
  if (!header['headers'])
    header['headers'] = {}
  header['headers'][url.LOBBY_KEY] = process.env.REACT_APP_LOBBY;
  header['headers'][url.LOBBY_MOB_PERM] = "new_ar_lob_mob_status";
  header['headers'][url.LOBBY_WEB_PERM] = "new_ar_lob_web_status";
  header['headers'][url.LOBBY_VERSION_KEY] = process.env.REACT_APP_LOBBY_VERSION;
  return axiosApi
    .post(end_url, data, header)
    .then((response) => {
      if (response.status >= 200 || response.status <= 299) {
        if (response.data.status == "ERROR") {
          if (response.data.code == "invalid_token_error" && extension != url.PLAYER_API.verifyLogin) {
            localStorage.removeItem(url.TOKEN_KEY);
            if (isWebView) {
              handelLogout();
            }
            else {
              window.location.href = base_url + "/sessionexpirelogout";
            }
          }
          else if (response.data.code == "inactive_partner" && response.data.code == "contact_to_customer_err") {
            showMessage(response);
            localStorage.removeItem(url.TOKEN_KEY);
            window.location.href = base_url + "/maintenance";
          }
          else if (response.data.code === "page_refresh") {
            window.location.reload()
          }
        }
        stopLoader(extension);
        return response.data;
      }
      stopLoader(extension);
      return { status: "ERROR", data: null };
    })
    .catch((err) => {
      stopLoader(extension);
      catchAxioExc(err);
      return { status: "ERROR", data: null, messages: generateCatchMsg(err) };
    });
};

const startLoader = (extension) => {
  if (!url.EXCLUDE_LOADER.includes(extension)) {
    if (custom_loader_count == 0) {
      let element = document.getElementById("ajax-loader");
      element.classList.remove("hideMe");
    }
    custom_loader_count++;
  }
};

const stopLoader = (extension) => {
  if (!url.EXCLUDE_LOADER.includes(extension)) {
    if (custom_loader_count != 0) custom_loader_count--;
    if (custom_loader_count == 0) {
      let element = document.getElementById("ajax-loader");
      element.classList.add("hideMe");
    }
  }
};

const generateCatchMsg = (err) => {
  var message;
  if (err.response && err.response.status) {
    switch (err.response.status) {
      case 404:
        message = "Sorry! the API you are looking for could not be found";
        break;
      case 500:
        message =
          "Sorry! something went wrong, please contact our support team";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      default:
        message = err[1];
        break;
    }
    return message;
  }
};

const catchAxioExc = (err) => {
  var message = generateCatchMsg(err);
  showMessage(message, "error");
};

const showMessage = (data, toastType, title) => {
  if (data.code === "you_ve_been_logged_out_successfully" || data.code === "invalid_token_error") {
    setTimeout(() => {
      handelLogout();
    }, 2000);
  }
  else {
    let message = data;
    if (data.messages) message = data.messages;
    if (!toastType) {
      toastType = data.status == "SUCCESS" ? "SUCCESS" : "error";
    }
    if (!title) title = toastType == "success" ? "Success" : camelCase(toastType);
    toastMessage(message, toastType, title);
  }
};

const toastMessage = (message, type, heading = "Error") => {
  document.getElementById("commonToaster").style.display = "flex";
  document.getElementById("commonToasterHeading").innerHTML = heading;
  document.getElementById("commonToasterBody").innerHTML = message;
};

const camelCase = (message) => {
  return message.charAt(0).toUpperCase() + message.slice(1);
};

// const removeLeadingZero = (str) => str.replace(/^0+/, ''); // Removes leading zeros
const removeLeadingZero = (str) => str.replace(/^0+/, ''); // Removes leading zeros

const formatDate = (date) => {
  // let arr = date.split(/[- :]/);
  // let d = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
  // return appendZero(d.getDate()) + '-' + appendZero(d.getMonth()) + '-' + appendZero(d.getFullYear()) + ' ' + appendZero(d.getHours()) + ':' + appendZero(d.getMinutes());
  let arr = date.split(/[- :]/);

  // Remove leading zeros where not needed
  let year = removeLeadingZero(arr[0]); // Year
  let month = appendZero(removeLeadingZero(arr[1])); // Month
  let day = appendZero(removeLeadingZero(arr[2])); // Day
  let hours = appendZero(arr[3] || '00'); // Hours (optional)
  let minutes = appendZero(arr[4] || '00'); // Minutes (optional)

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

const appendZero = (val) => {
  return val.length === 1 ? '0' + val : val; // Ensures two-digit format
};

const formatPrice = (price) => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export { makeAjax, url, tokenPrefix, showMessage, camelCase, formatDate, formatPrice };
