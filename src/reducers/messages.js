import _ from 'lodash';
import {
  GET_MESSAGES,
  CLEAR_MESSAGES,
  UPDATE_MESSAGES,
  RECEIVE_PRIVATE_MESSAGE,
  CLEAR_SKIP,
  DELETE_MESSAGE,
  UPDATE_MESSAGES_CHAT_ID,
  SET_MESSAGES
} from '../actions';

import { messagesConfig } from '../constants';

const initialState = {
  messagesList: [],
  limit: messagesConfig.maxLength,
  skip: 0,
  voiceMessage: null,
  isVoiceMessageLoading: false
};

export const messages = (state = initialState, { type, payload }) => {
  switch (type) {
  case GET_MESSAGES:{
    const shopUniqMess=_.uniqBy([...payload, ...state.messagesList],'_id')
    return {
      ...state,
      messagesList: shopUniqMess,
      skip: state.skip + state.limit,
  }};

  case SET_MESSAGES:{
    const shopUniqMess=_.uniqBy([...payload, ...state.messagesList],'_id')
    return {
      ...state,
      messagesList: shopUniqMess,
      skip: payload.length,
  }};

  case UPDATE_MESSAGES:{
    const shopUniqMess=_.uniqBy([...state.messagesList, payload],'_id')
    return {
      ...state,
      messagesList: shopUniqMess,
      skip: state.skip + 1,
  }};

  case DELETE_MESSAGE:
    return {
      ...state,
      messagesList: state.messagesList.filter(message => message._id !== payload._id),
      skip: state.skip > 0 ? state.skip - 1 : state.skip,
    };

  case UPDATE_MESSAGES_CHAT_ID:
    return {
      ...state,
      messagesList: state.messagesList.map(message => {
        if (!message.chatId) {
          message.chatId = payload;

          return message;
        }

        return message;
      }),
    };

  case RECEIVE_PRIVATE_MESSAGE: {
    if (
      payload.activeChat &&
      payload.activeChat._id === payload.receiverMessage.chat._id &&
      payload.phone !== payload.receiverMessage.sender
    ) {
      const shopUniqMess=_.uniqBy([...state.messagesList, payload.receiverMessage],'_id')
      return {
        ...state,
        messagesList: shopUniqMess,
        skip: state.skip + 1,
      };
    }

    return state;
  }

  case CLEAR_MESSAGES:
    return {
      ...state,
      messagesList: [],
    };

  case CLEAR_SKIP:
    return {
      ...state,
      skip: 0,
    };

  default:
    return state;
  }
};
