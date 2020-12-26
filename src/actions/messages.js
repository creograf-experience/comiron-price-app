import {getChatMessages} from '../networkers'

export const GET_MESSAGES = 'GET_MESSAGES';
export const SET_MESSAGES = 'SET_MESSAGES';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const UPDATE_MESSAGES = 'UPDATE_MESSAGES';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
export const RECEIVE_PRIVATE_MESSAGE = 'RECEIVE_PRIVATE_MESSAGE';
export const CLEAR_SKIP = 'CLEAR_SKIP';
export const UPDATE_MESSAGES_CHAT_ID = 'UPDATE_MESSAGES_CHAT_ID';
export const RECEIVE_VOICE_MESSAGE = 'RECEIVE_VOICE_MESSAGE';
export const CLEAR_VOICE_MESSAGE = 'CLEAR_VOICE_MESSAGE';
export const SET_VOICE_MESSAGE_LOADING = 'SET_VOICE_MESSAGE_LOADING';

export const fetchMessages = chatId => async (dispatch, getState) => {
  try {
    const { limit, skip } = getState().messages;

    const res = await getChatMessages({
      chatId,
      limit,
      skip
    });
    
    dispatch({
      type: GET_MESSAGES,
      payload: res,
    });

    return res;

  } catch (err) {
    console.error(err);
  }
};

export const sendMessageToServer = data => (dispatch, getState) => {
  const { socket } = getState().socket;
  if (!socket) return;

  socket.emit('create message', data);
};

export const requestSpeechToText = data => (dispatch, getState) => {
  const { socket } = getState().socket;
  if (!socket) return;

  dispatch({
    type: SET_VOICE_MESSAGE_LOADING,
    payload: true
  });

  socket.emit('voice message', data);
};

export const deleteMessage = data => (dispatch, getState) => {
  const { messagesList } = getState().messages;
  const prevMessage = messagesList[messagesList.length - 2];

  dispatch({
    type: DELETE_MESSAGE,
    payload: {
      _id: data._id,
      chatId: data.chat,
      latestMessage: prevMessage,
    },
  });

  const { socket } = getState().socket;
  if (!socket) return;

  socket.emit('delete message', data);
};

export const updateMessages = message => dispatch => (
  dispatch({
    type: UPDATE_MESSAGES,
    payload: message,
  })
);

export const updateMessagesChatId = chatId => dispatch => (
  dispatch({
    type: UPDATE_MESSAGES_CHAT_ID,
    payload: chatId,
  })
);

export const clearMessages = () => dispatch => (
  dispatch({
    type: CLEAR_MESSAGES,
  })
);

export const clearSkip = () => dispatch => (
  dispatch({
    type: CLEAR_SKIP,
  })
);

export const setMessages = messages => dispatch => (
  dispatch({
    type: SET_MESSAGES,
    payload: messages
  })
);
