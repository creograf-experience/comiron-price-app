import {
  SET_SOCKET,
  SET_SOCKET_CONNECTION
} from '../actions';

const initialState = {
  isSocketConnected: false,
  socket: null,
};

export const socket = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_SOCKET:
      return {
        ...state,
        socket: payload,
      };

    case SET_SOCKET_CONNECTION:
      return {
        ...state,
        isSocketConnected: payload,
      };

    default:
      return state;
  }
};