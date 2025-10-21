import { call, put, all, takeLeading } from "redux-saga/effects";
// Login Redux States
import { USER_PROFILE } from "./actionTypes";
import { getUserProfileSuccess } from "./actions";
import { makeAjax, showMessage, url } from "../../helpers/global_helper";

function* getUserProfile({ payload: { formData } }) {
  try {

    const response = yield call(
      makeAjax,
      url.PLAYER_API.getUser, {}, url.PLAYER_MS_EXT);
    if (response.status == 'SUCCESS') {
      yield all([
        put(getUserProfileSuccess(response.data.user))
      ]);
      // if (!response.data.user.nickname && window.location.href != window.location.origin + "/nickname") {
      //   window.location.href = window.location.origin + "/nickname";
      // }
      if (response.data.user.nickname) {
        if (window.location.href === window.location.origin + "/nickname") {
          window.location.href = window.location.origin + "/";
        }
      } else {
        if (window.location.pathname !== "/nickname") {
          window.history.pushState({}, "", "/nickname");
          window.dispatchEvent(new Event("popstate"));
        }
      }
    } 
    else {
      showMessage(response);
    }
  } catch (error) {

  }
}

function* userProfileSaga() {
  yield takeLeading(USER_PROFILE, getUserProfile);
}
export default userProfileSaga;
