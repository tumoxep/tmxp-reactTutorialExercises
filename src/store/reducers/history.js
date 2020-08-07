import { ADD_TO_HISTORY } from "../actionTypes";

const initialState = [{
  squares: Array(9).fill(null),
}];

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_HISTORY: {
      return state.slice(0, action.payload.stepNumber + 1).concat([ action.payload.item ]);
    }
    default:
      return state;
  }
}
