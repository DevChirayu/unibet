import { SET_DATA_IN_ONEPAGE, SET_PAGE_NUMBER, SET_PAGINATION, SET_TOTAL_NO_RESULT, SET_CURRENT_STEP, SET_CLICK_STEP, SET_IS_SETTING_COACH_MARK } from "./actionTypes"

const initialState = {
  pagination: "Transaction",
  pageNumber: 1,
  dataInOnePage: 10,
  totalNumberOfResult: 0,
  currentStep: 0, // Default: -1 Don't show CoachMark
  isSettingCoachMark:false,
  clickStep: 1
}

const paginationData = (state = initialState, action) => {
  switch (action.type) {
    case SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload
      };
    case SET_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: action.payload
      };
    case SET_DATA_IN_ONEPAGE:
      return {
        ...state,
        dataInOnePage: action.payload
      };
    case SET_TOTAL_NO_RESULT:
      return {
        ...state,
        totalNumberOfResult: action.payload
      };
      case SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload
      };
      case SET_CLICK_STEP:
      return {
        ...state,
        clickStep: action.payload
      };
      case SET_IS_SETTING_COACH_MARK:
        return {
          ...state,
          isSettingCoachMark: action.payload
        };  
    default:
      return state;
  }
};

export default paginationData
