import {
  executeRequest,
  getUserToken,
  getUserRefreshToken,
} from "../utils";

export const fetchCarts_SZ = async () => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "GET",
    url: "cart_sz",
    tokens: { access_token: token, refresh_token: refreshToken },
  });
};