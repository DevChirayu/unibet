import {
  USER_PROFILE_SUCCESS
} from "./actionTypes"

const initialState = {}

const UserProfile = (state = initialState, action) => {
  switch (action.type) {
    case USER_PROFILE_SUCCESS:
      state = action.payload;
      break
  }
  return state
}

export default UserProfile
