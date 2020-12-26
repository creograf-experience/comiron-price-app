import {
  executeRequest,
  getUserToken,
  getUserRefreshToken,
} from "../utils";

export const getCartSZ_SiteNetworkRequest = async (shop_id, price_id, token, refreshToken) => {
  token = await getUserToken();
  refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "GET",
    url:`cart_sz/find_one?shop_id=${shop_id}&price_id=${price_id}`,
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const addItemSZ_InSiteNetworkRequest = async (id, num, price_id, source, is_sz, enddate, token, refreshToken) => {
  token = await getUserToken();
  refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "POST",
    url:`shop/cart_add/${id}`,
    body: {
      content: `num=${num}&price_id=${price_id}&source=${source}&is_sz=${is_sz}&enddate=${enddate}`,
      contentType: "application/x-www-form-urlencoded"
    },
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const setItemSZ_CountInSiteNetworkRequest = async (id, num, price_id, source, is_sz, enddate, token, refreshToken) => {
  token = await getUserToken();
  refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "POST",
    url: `shop/cart_set/${id}`,
    body: {
      content: `num=${num}&price_id=${price_id}&source=${source}&is_sz=${is_sz}&enddate=${enddate}`,
      contentType: "application/x-www-form-urlencoded"
    },
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const deleteCartSZ_SiteNetworkRequest = async (cartId, token, refreshToken) => {
  token = await getUserToken();
  refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "GET",
    url: `shop/cart_delete/${cartId}?is_sz=1`,
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const OrderSZ_NetworkRequest = async (order, token, refreshToken) => {
  token = await getUserToken();
  refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "POST",
    url: `cart_sz/create_order`,
    body: {
      content: JSON.stringify(order),
      contentType: "application/json"
    },
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};