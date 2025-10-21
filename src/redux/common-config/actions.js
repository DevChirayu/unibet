import {
  SET_COMMON_CONFIG,
  GET_GLOBAL_CONFIG,
  SET_MASS_CONFIG
} from "./actionTypes"

export const setCommonConfig = response => {
  return {
    type: SET_COMMON_CONFIG,
    payload: response,
  }
}

export const setMassConfig = response => {
  return {
    type: SET_MASS_CONFIG,
    payload: response,
  }
}

export const getGlobalConfig = () => {
  return {
    type: GET_GLOBAL_CONFIG
  }
}