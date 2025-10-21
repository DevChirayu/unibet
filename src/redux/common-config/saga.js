import { call, put, all, takeLeading } from "redux-saga/effects";
// Login Redux States
import { GET_GLOBAL_CONFIG, USER_PROFILE } from "./actionTypes";
import { setMassConfig } from "./actions";
import { makeAjax, showMessage, url } from "../../helpers/global_helper";

function* getGlobalConfig() {
  try {
    const response = yield call(
      makeAjax,
      url.PLAYER_API.getGlobalConfig, {}, url.PLAYER_MS_EXT);
    if (response.status == 'SUCCESS') {
      yield all([
        put(setMassConfig(response.data))
      ]);
      return;
    }
    showMessage(response);
  } catch (error) {

  }
}

function* commonConfigSaga() {
  yield takeLeading(GET_GLOBAL_CONFIG, getGlobalConfig);
}
export default commonConfigSaga;
