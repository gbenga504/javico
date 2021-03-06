import { combineReducers } from "redux";
import { IUser } from "@javico/common/lib/apis/users";

import { SET_CURRENT_USER, LOGOUT_REQUEST } from "./actionTypes";

const initialState = null as IUser | null;

const currentUserReducer = (
  state = initialState,
  action: { type: string; payload?: IUser }
) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return action.payload;
    case LOGOUT_REQUEST:
      return initialState;
    default:
      return state;
  }
};

export default combineReducers({
  currentUser: currentUserReducer
});

export const getCurrentUserState = (state: any) => state.auth.currentUser;
