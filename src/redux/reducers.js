import { combineReducers } from "redux"


// Authentication
import UserProfile from "./user-profile/reducer"
import UserBalance from "./user-balance/reducer"
import CommonConfig from "./common-config/reducer"
import paginationData from "./pagination/reducer";

const rootReducer = combineReducers({
  UserProfile,
  UserBalance,
  CommonConfig,
  paginationData

})

export default rootReducer
