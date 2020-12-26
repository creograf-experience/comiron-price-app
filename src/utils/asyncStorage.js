import { AsyncStorage } from "react-native";
import { messagesConfig } from '../constants';

export const getUserToken = async () => {
  try {
    return await AsyncStorage.getItem("comironUserToken");
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem("comironUserRefreshToken");
  } catch (error) {
    console.log(error.message);
  }
};

export const saveUserToken = async (userToken, userRefreshToken) => {
  try {
    await AsyncStorage.setItem("comironUserToken", userToken);
    await AsyncStorage.setItem("comironUserRefreshToken", userRefreshToken);
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteUserToken = async () => {
  try {
    await AsyncStorage.setItem("comironUserToken", "");
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserProfile = async () => {
  try {
    return await AsyncStorage.getItem("comironUserProfile");
  } catch (error) {
    console.log(error.message);
  }
};

export const saveUserProfile = async userId => {
  try {
    await AsyncStorage.setItem("comironUserProfile", userId);
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteUserProfile = async () => {
  try {
    await AsyncStorage.setItem("comironUserProfile", "");
  } catch (error) {
    console.log(error.message);
  }
};

// viewed prices

export const getViewedPrices = async () => {
  try {
    return await AsyncStorage.getItem("viewedPrices");
  } catch (error) {
    console.log(error.message);
  }
};

export const setViewedPrices = async prices => {
  try {
    await AsyncStorage.setItem("viewedPrices", prices);
  } catch (error) {
    console.log(error.message);
  }
};

export const getViewedCoopPrices = async () => {
  try {
    return await AsyncStorage.getItem("viewedCoopPrices");
  } catch (error) {
    console.log(error.message);
  }
};

export const setViewedCoopPrices = async prices => {
  try {
    await AsyncStorage.setItem("viewedCoopPrices", prices);
  } catch (error) {
    console.log(error.message);
  }
};

// Expo Pushtoken
export const getExpoPushtoken = async () => {
  try {
    return await AsyncStorage.getItem("ExpoPushToken");
  } catch (error) {
    console.log(error.message);
  }
};

export const setExpoPushtoken = async token => {
  try {
    await AsyncStorage.setItem("ExpoPushToken", token);
  } catch (error) {
    console.log(error.message);
  }
};

// Coop Purchases
export const getCoopOrder = async priceId => {
  try {
    return JSON.parse(
      await AsyncStorage.getItem(`coop-price-${priceId}`)
    );
  } catch (error) {
    console.log(error.message);
  }
};

export const setCoopOrder = async (priceId, data) => {
  try {
    await AsyncStorage.setItem(`coop-price-${priceId}`, data);
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteCoopOrder = async priceId => {
  try {
    await AsyncStorage.removeItem(`coop-price-${priceId}`);
  } catch (error) {
    console.log(error.message);
  }
};

export const setAddUserAgree= async ()=>{
  try {
    await AsyncStorage.setItem("userAgreement", "true");
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserAgree = async () => {
  try {
    return await AsyncStorage.getItem("userAgreement");
  } catch (error) {
    console.log(error.message);
  }
};

export const saveUserPhone = async phone => {
  try {
    await AsyncStorage.setItem("comironUserPhone", phone);
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserPhone = async () => {
  try {
    return await AsyncStorage.getItem("comironUserPhone");
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteUserPhone = async () => {
  try {
    await AsyncStorage.setItem("comironUserPhone", "");
  } catch (error) {
    console.log(error.message);
  }
};

//Операции с сообщениями чата
async function saveMessage(msg) {
  try {
    //console.log('msg',msg)
    const messages = await getMessages(`chat-${msg.chat._id}`);
    //console.log('checkMessageinSaveMessage',messages)
    if(messages){
      await AsyncStorage.setItem(
        `chat-${msg.chat._id}`,
        JSON.stringify([msg])
      );
      return;
    }

    let newMessages = [];

    if (messages.length < messagesConfig.maxLength) {
      newMessages = JSON.stringify([...messages, msg]);
    } else {
      newMessages = JSON.stringify([...messages.slice(1), msg]);
    }
  
    await AsyncStorage.setItem(`chat-${msg.chat._id}`, newMessages);

  } catch (err){
    console.warn(err)
  }
}

async function saveMessages(messages, chatId) {
  try {
    //console.log('chatid',chatId)
    const messagesJSON = JSON.stringify(messages);
    await AsyncStorage.setItem(`chat-${chatId}`, messagesJSON);

  } catch (err) {
    console.warn(err);
  }
}

async function getMessages(itemId) {
  try {
    //console.log('getMessagesItemid',itemId)
    const messages = await AsyncStorage.getItem(itemId);
    //console.log('getMessages',JSON.parse(messages))
    return JSON.parse(messages);

  } catch (err) {
    console.warn(err);
  }
}

export default {
  saveMessage,
  saveMessages,
  getMessages
}