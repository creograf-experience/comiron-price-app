import { hostChat } from '../constants';
import { AsyncStorage } from 'react-native';

async function makeRequestForChat({
  method = 'GET',
  url,
  body = null,
  withToken = true
}) {
  let requestOptions = {
    method,
    headers: await getHeaders(withToken)
  }

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  const requestUrl = hostChat + url;
  const res = await fetch(requestUrl, requestOptions);
  return res.json()
};

async function getHeaders(withToken) {
  return {
    'Content-Type': 'application/json',
    Authorization: withToken && await AsyncStorage.getItem('chat-token')
  };
}

export default makeRequestForChat;