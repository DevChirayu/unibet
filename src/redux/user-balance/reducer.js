import {
  USER_BALANCE_SUCCESS
} from "./actionTypes"

const initialState = {
  user_balance: {
    coin: 0.00,
    countNotif: 0
  }
}

const UserBalance = (state = initialState, action) => {
  switch (action.type) {
    case USER_BALANCE_SUCCESS:
      return {
        ...state,
        user_balance: action.payload
      };
    default:
      return state;
  }
}

export default UserBalance
