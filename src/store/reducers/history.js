import { SET_HISTORY } from "../actionTypes";

const initialState = [{
  squares: Array(9).fill(null),
}];

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_HISTORY: {
      return action.payload;
    }
    default:
      return state;
  }
}
