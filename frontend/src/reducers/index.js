import { GET_BOOKS } from "../actiontypes";
const initialState = {
  books: [],
  api_response: {},
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case GET_BOOKS:
      return {
        ...state,
        books: action.payload.data.res,
        api_response: action.payload.data.status,
      };
    default:
      return state;
  }
}
