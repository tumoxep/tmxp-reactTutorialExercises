import { SET_HISTORY } from "./actionTypes";

export const setHistory = content => ({
  type: SET_HISTORY,
  payload: content,
});
