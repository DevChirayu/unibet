import {
  USER_BALANCE,
  USER_BALANCE_SUCCESS
} from "./actionTypes"


export const getUserBalance = () => {
  return {
    type: USER_BALANCE,
    payload: {},
  }
}

export const getUserBalanceSuccess = response => {
  return {
    type: USER_BALANCE_SUCCESS,
    payload: response,
  }
}