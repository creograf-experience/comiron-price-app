import {
  executeRequest,
  getExpoPushtoken,
  getUserToken,
  getUserRefreshToken
} from "../utils";

export const logInNetworkRequest = async (login, password) => {
  const pushtoken = await getExpoPushtoken();

  const data =
    `${encodeURIComponent("login_email")}=${encodeURIComponent(login)}&` +
    `${encodeURIComponent("login_password")}=${encodeURIComponent(password)}&` +
    `${encodeURIComponent("pushtoken")}=${encodeURIComponent(pushtoken)}`;

  return executeRequest({
    method: "POST",
    url: "auth/signin",
    body: {
      content: data,
      contentType: "application/x-www-form-urlencoded"
    }
  });
};
export const checkProfileNetworkRequest = async (token = null, refreshToken = null) => {
  token = token || await getUserToken();
  refreshToken = refreshToken || await getUserRefreshToken();

  return executeRequest({
    method: "GET",
    url: `profile/my`,
    tokens: { access_token: token,refresh_token: refreshToken }
  });
};