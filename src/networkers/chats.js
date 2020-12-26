import makeRequestForChat from './makeRequestForChat'; 
import {
  executeRequest,
  getUserToken,
  getUserRefreshToken,
} from "../utils";

export async function addToken(token) {
  return makeRequestForChat({
    method:'POST',
    url: '/users/pushtokens',
    body: {token}
  })
}

export async function getUserChats() {
  return makeRequestForChat({url:'/users/chats'});
}

export async function savePhone(phone) {
  return makeRequestForChat({
    method:'POST',
    url:'/users/auth/save-phone',
    body: { phone }
  })
}

export async function verifyPhone(phone) {
  return makeRequestForChat({
    method: 'POST',
    url: '/users/auth/is-verified',
    body: { phone },
    withToken: false
  });
}

export async function addMany(contacts) {
  return makeRequestForChat({
    method: 'POST',
    url: '/users/contacts',
    body: { contacts },
    withToken: false
  });
}

export const getEmployeShops = async (shop_id) => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "GET",
    url: `employee/readlist?shop_id=${shop_id}`,
    tokens: { access_token: token, refresh_token: refreshToken },
  });
};

export const getUserContacts = (phones) => {
  return executeRequest({
    method: "POST",
    url: `profile/persons_by_phones`,
    body: {
      content: JSON.stringify(phones),
      contentType: "application/json"
    }
  });
};