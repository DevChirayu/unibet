import { call, put, all, takeLeading } from "redux-saga/effects";
import { navigate } from "react-router-dom";
// Login Redux States
import { USER_BALANCE } from "./actionTypes";
import { getUserBalanceSuccess } from "./actions";
import { makeAjax, showMessage, url, respStatus } from "../../helpers/global_helper";
const base_url = window.location.origin;
function* getUserBalance({ payload: { formData } }) {
  try {
    const response = yield call(
      makeAjax,
      url.PLAYER_API.getUserBalance, {}, url.PLAYER_MS_EXT);
    if (response.status != respStatus["SUCCESS"]) {
      if (response.code == "inactive_partner") {
        window.location.href = base_url + "/maintenance";
        showMessage("Lobby Under Maintenance", "error", "error")
        return
      }
      else if (response.code == "partner_is_down") {
        return
      }
      showMessage(response);
      return
    } else {
      yield all([
        put(getUserBalanceSuccess(response.data))
      ]);
    }
    // else {
    //   showMessage(response);
    // }
  } catch (error) {
  }
}

function* userBalanceSaga() {
  yield takeLeading(USER_BALANCE, getUserBalance);
}
export default userBalanceSaga;
