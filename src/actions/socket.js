export const CONNECT_SOCKET = 'CONNECT_SOCKET';
export const DISCONNECT_SOCKET = 'DISCONNECT_SOCKET';

export const SET_SOCKET_CONNECTION = 'SET_SOCKET_CONNECTION';
export const SET_SOCKET = 'SET_SOCKET';

export const connectSocket = () => dispatch =>
  dispatch({ type: CONNECT_SOCKET });

export const disconnectSocket = () => dispatch =>
  dispatch({ type: DISCONNECT_SOCKET });

