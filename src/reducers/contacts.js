import {
  GET_CONTACTS,
} from '../actions';

const initialState = {
  contactList: [],
};

export const contacts = (state = initialState, { type, payload }) => {
  switch (type) {
  case GET_CONTACTS:
    return {
      ...state,
      contactList: payload,
    };
  default:
    return state;
  }
};
