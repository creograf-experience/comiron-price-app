import makeRequestForChat from './makeRequestForChat';

export async function getChatMessages({chatId, limit, skip}) {
  return makeRequestForChat({
    url:`/users/messages/${chatId}?limit=${limit}${skip}`
  });
}