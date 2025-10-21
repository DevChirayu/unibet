import {
  SET_COMMON_CONFIG,
  SET_MASS_CONFIG
} from "./actionTypes"

const initialState = {
  device_type: null,
  ftp_url: "",
  promoStatus: 0,
}

const CommonConfig = (state = initialState, action) => {
  let tempState = { ...state };
  switch (action.type) {
    case SET_COMMON_CONFIG:
      tempState[action.payload.key] = action.payload.value;
      state = { ...state, ...tempState };
      break
    case SET_MASS_CONFIG:
      state = { ...state, ...action.payload };
      break
  }
  return state
}

export default CommonConfig
