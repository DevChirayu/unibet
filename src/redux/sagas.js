import { all, fork } from "redux-saga/effects"

//public
import userProfileSaga from "./user-profile/saga";
import userBalanceSaga from "./user-balance/saga";
import commonConfigSaga from "./common-config/saga";



export default function* rootSaga() {
  yield all([
    //public
    fork(userProfileSaga),
    fork(userBalanceSaga),
    fork(commonConfigSaga),
  ])
}
