import {
  USER_PROFILE,
  USER_PROFILE_SUCCESS
} from "./actionTypes"


export const getUserProfile = () => {
  return {
    type: USER_PROFILE,
    payload: {},
  }
}

export const getUserProfileSuccess = response => {
  return {
    type: USER_PROFILE_SUCCESS,
    payload: response,
  }
}