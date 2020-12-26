import { executeRequest } from "../utils";
import { getUserToken, getUserRefreshToken } from "../utils";

export const sendPhotoNetworkRequest = async photo => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();
  return executeRequest({
    method: "POST",
    url: "profile/uploadprofileimg",
    body: {
      content: photo,
      contentType: "multipart/form-data"
    },
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const savePhotoNetworkRequest = async data => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();
  return executeRequest({
    method: "POST",
    url: "profile/cropprofileimg",
    body: {
      content: data,
      contentType: "multipart/form-data"
    },
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const saveStandardCommentRequest = async standardComment => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();
  return executeRequest({
    method: "POST",
    url: "profile/edit",
    body: {
      content: `standartcomments=${standardComment}`,
      contentType: "application/x-www-form-urlencoded"
    },
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const deleteUserAddressRequest = async id => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();

  return executeRequest({
    method: "GET",
    url: `address/delete/${id}`,
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};
