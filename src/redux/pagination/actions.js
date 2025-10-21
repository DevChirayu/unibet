import { SET_DATA_IN_ONEPAGE, SET_PAGE_NUMBER, SET_PAGINATION, SET_TOTAL_NO_RESULT, SET_CURRENT_STEP, SET_CLICK_STEP, SET_IS_SETTING_COACH_MARK } from "./actionTypes"


export const setPaginationData = (payload) => {
  return {
    type: SET_PAGINATION,
    payload: payload,
  }
}

export const pageNumberInfo = payload => {
  return {
    type: SET_PAGE_NUMBER,
    payload: payload,
  }
}

export const dataEntryPerPage = payload => {
  return {
    type: SET_DATA_IN_ONEPAGE,
    payload: payload,
  }
}

export const setTotalNoResult = payload => {
  return {
    type: SET_TOTAL_NO_RESULT,
    payload: payload,
  }
}

export const setCurrentStep = payload => {
  return {
    type: SET_CURRENT_STEP,
    payload: payload,
  }
}

export const setClickCount = payload => {
  return {
    type: SET_CLICK_STEP,
    payload: payload,
  }
}

export const setIsSettingCoachMark = payload => {
  return {
    type: SET_IS_SETTING_COACH_MARK,
    payload: payload,
  }
}