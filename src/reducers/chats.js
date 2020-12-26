import _ from 'lodash';
import {
  GET_ALL_CHATS,
  RECEIVER_CHAT,
  SENDER_CHAT,
  RECEIVE_MESSAGE,
  RECEIVE_PRIVATE_MESSAGE,
  RECEIVE_BLOCKED_CHAT,
  RECEIVE_MIRROR_BLOCKED_CHAT,
  CLEAR_NOTIFICATION,
  SET_ACTIVE_CHAT,
  CLEAR_ACTIVE_CHAT,
  DELETE_MESSAGE,
  GET_EMPLOYE_SHOP,
  FLAG_RERENDER
} from '../actions';

const initialState = {
  shopChatList:[],
  chatList: [],
  activeChat: null,
  employeList: [],
  flagRerender: false
};

export const chats = (state = initialState, { type, payload }) => {
  switch (type) {
  case GET_ALL_CHATS:
    const noShop =payload.filter(item=>!item.shop)
    const shopUniqChat=_.uniqBy(payload.filter(item=>item.shop),'shop.id')
    const newShopChatList=shopUniqChat.concat(noShop)
    const sortArray = _.sortBy(newShopChatList,'latestMessage.updatedAt').reverse()
    return {
      ...state,
      chatList: payload,
      shopChatList: sortArray
    };

  case SET_ACTIVE_CHAT:
    return {
      ...state,
      activeChat: payload,
    };

  case CLEAR_ACTIVE_CHAT:
    return {
      ...state,
      activeChat: null,
    };

  case RECEIVER_CHAT:{
    const newPayload =[payload, ...state.chatList];
    const noShop = newPayload.filter(item=>!item.shop);
    const shopUniqChat=_.uniqBy(newPayload.filter(item=>item.shop),'shop.id');
    const newShopChatList=shopUniqChat.concat(noShop)
    const sortArray = _.sortBy(newShopChatList,'latestMessage.updatedAt').reverse()
    return {
      ...state,
      chatList: [payload, ...state.chatList],
      shopChatList: sortArray
    }};

  case SENDER_CHAT:{
    const newPayload =[payload, ...state.chatList];
    const noShop = newPayload.filter(item=>!item.shop);
    const shopUniqChat=_.uniqBy(newPayload.filter(item=>item.shop),'shop.id');
    const newShopChatList=shopUniqChat.concat(noShop)
    const sortArray = _.sortBy(newShopChatList,'latestMessage.updatedAt').reverse()
    return {
      ...state,
      chatList: [payload, ...state.chatList],
      shopChatList: sortArray,
      activeChat: payload,
  }};

  case DELETE_MESSAGE: {
    const updatedList = state.chatList.map(chat => {
      if (
        chat._id === payload.chatId &&
        (chat.latestMessage._id === payload._id || chat.latestMessage.uuid === payload._id)
      ) {
        return { ...chat, latestMessage: payload.latestMessage ? payload.latestMessage : null };
      }

      return chat;
    });
    const noShop = updatedList.filter(item=>!item.shop);
    const shopUniqChat=_.uniqBy(updatedList.filter(item=>item.shop),'shop.id');
    const newShopChatList=shopUniqChat.concat(noShop)
    const sortArray = _.sortBy(newShopChatList,'latestMessage.updatedAt').reverse()
    return {
      ...state,
      chatList: updatedList,
      shopChatList: sortArray
    };
  }

  case RECEIVE_MESSAGE: {
    const chat = findChat(payload.chat._id, state.chatList);
    const updatedChat = {
      ...chat,
      latestMessage: payload,
    };
    const updatedList = deleteOriginalChat(updatedChat._id, state.chatList);
    const newPayload =[updatedChat, ...updatedList];
    const noShop = newPayload.filter(item=>!item.shop);
    const shopUniqChat=_.uniqBy(newPayload.filter(item=>item.shop),'shop.id');
    const newShopChatList=shopUniqChat.concat(noShop)
    const sortArray = _.sortBy(newShopChatList,'latestMessage.updatedAt').reverse()
    return {
      ...state,
      chatList: [updatedChat, ...updatedList],
      shopChatList: sortArray
    };
  }

  case RECEIVE_PRIVATE_MESSAGE: {
    const chat = findChat(payload.receiverMessage.chat._id, state.chatList);
    const updatedChat = {
      ...chat,
      latestMessage: payload.receiverMessage,
      notificationCount: !payload.activeChat || payload.activeChat._id !== chat._id ? chat.notificationCount + 1 : chat.notificationCount,
    };

    const updatedList = deleteOriginalChat(updatedChat._id, state.chatList);
    const newPayload =[updatedChat, ...updatedList];
    const noShop = newPayload.filter(item=>!item.shop);
    const shopUniqChat=_.uniqBy(newPayload.filter(item=>item.shop),'shop.id');
    const newShopChatList=shopUniqChat.concat(noShop)
    const sortArray = _.sortBy(newShopChatList,'latestMessage.updatedAt').reverse()
    return {
      ...state,
      chatList: [updatedChat, ...updatedList],
      shopChatList: sortArray
    };
  }

  case RECEIVE_BLOCKED_CHAT: {
    const updatedList = state.chatList.map(chat => {
      if (chat._id === payload) {
        return { ...chat, isBlocked: !chat.isBlocked };
      }

      return chat;
    });
    const noShop = updatedList.filter(item=>!item.shop);
    const shopUniqChat=_.uniqBy(updatedList.filter(item=>item.shop),'shop.id');
    const newShopChatList=shopUniqChat.concat(noShop)
    const sortArray = _.sortBy(newShopChatList,'latestMessage.updatedAt').reverse()
    return {
      ...state,
      chatList: updatedList,
      shopChatList: sortArray
    };
  }

  case RECEIVE_MIRROR_BLOCKED_CHAT: {
    const updatedList = state.chatList.map(chat => {
      if (chat._id === payload) {
        return { ...chat, isMirrorBlocked: !chat.isMirrorBlocked };
      }

      return chat;
    });
    const noShop = updatedList.filter(item=>!item.shop);
    const shopUniqChat=_.uniqBy(updatedList.filter(item=>item.shop),'shop.id');
    const newShopChatList=shopUniqChat.concat(noShop)
    const sortArray = _.sortBy(newShopChatList,'latestMessage.updatedAt').reverse()
    return {
      ...state,
      chatList: updatedList,
      shopChatList: sortArray
    };
  }

  case CLEAR_NOTIFICATION: {
    const updatedList = state.chatList.map(chat => {
      if (chat._id === payload) {
        return { ...chat, notificationCount: 0 };
      }

      return chat;
    });
    const noShop = updatedList.filter(item=>!item.shop);
    const shopUniqChat=_.uniqBy(updatedList.filter(item=>item.shop),'shop.id');
    const newShopChatList=shopUniqChat.concat(noShop)
    const sortArray = _.sortBy(newShopChatList,'latestMessage.updatedAt').reverse()
    return {
      ...state,
      chatList: updatedList,
      shopChatList: sortArray
    };
  }

  case GET_EMPLOYE_SHOP:
     return {
    ...state,
    employeList: payload,
  };

  case FLAG_RERENDER:
     return {
    ...state,
    flagRerender: payload,
  };

  default:
    return state;
  }
};

const findChat = (chatId, chatList) => 
  chatList.find(chat => chat._id === chatId);

const deleteOriginalChat = (updatedChatId, chatList) =>
  chatList.filter(chat => chat._id !== updatedChatId);
