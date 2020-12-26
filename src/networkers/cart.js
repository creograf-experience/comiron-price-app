import {
  executeRequest,
  getUserToken,
  getUserRefreshToken,
} from "../utils";

export const fetchCarts = async () => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "GET",
    url: "central/cart",
    tokens: { access_token: token, refresh_token: refreshToken },
  });
};
