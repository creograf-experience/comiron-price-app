import {
  executeRequest,
  getUserToken,
  getUserRefreshToken,
} from "../utils";

export const sendOrderNetworkRequest = order => {
  return executeRequest({
    method: "POST",
    url: `price/send_order`,
    body: {
      content: JSON.stringify(order),
      contentType: "application/json"
    }
  });
};

export const sendNewOrderNetworkRequest = async (newOrder, order) => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();
  
  let params = new URLSearchParams();

  for (const key of Object.keys(newOrder)) {
    params.append(key, newOrder[key]);
  }

  // console.log(params.toString());

  // const headers = new Headers();

  // headers["Access-token"] = token;
  // headers["Refresh-token"] = refreshToken;

  // const res = await fetch(`https://comironserver.comiron.com/shop/cart_send/?${params.toString()}`, {
  //   method: "GET",
  //   headers
  // })
  // return await res.json();

  return await executeRequest({
    method: "POST",
    url: `shop/cart_send/?${params.toString()}`,
    body: {
      content: JSON.stringify(order),
      contentType: "application/json"
    },
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const updateOrderNetworkRequest = (id, order) => {
  return executeRequest({
    method: "POST",
    url: `price/order_save/${id}`,
    body: {
      content: JSON.stringify(order),
      contentType: "application/json"
    }
  });
};

export const getCartSiteNetworkRequest = async (id, token, refreshToken) => {
  token = await getUserToken();
  refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "GET",
    url:`shop/cart/${id}`,
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const addItemInSiteNetworkRequest = async (id, num, price_id, source, token, refreshToken) => {
  token = await getUserToken();
  refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "POST",
    url:`shop/cart_add/${id}`,
    body: {
      content: `num=${num}&price_id=${price_id}&source=${source}`,
      contentType: "application/x-www-form-urlencoded"
    },
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const setItemCountInSiteNetworkRequest = async (id, num, price_id, source, token, refreshToken) => {
  token = await getUserToken();
  refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "POST",
    url: `shop/cart_set/${id}`,
    body: {
      content: `num=${num}&price_id=${price_id}&source=${source}`,
      contentType: "application/x-www-form-urlencoded"
    },
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const deleteCartSiteNetworkRequest = async (numberProductId, token, refreshToken) => {
  token = await getUserToken();
  refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "GET",
    url: `shop/cart_delete/${numberProductId}`,
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const newOrderNetworkRequest = async (shop_id, comment_person, phone, order, token, refreshToken) => {
  token = await getUserToken();
  refreshToken = await getUserRefreshToken();
  
  return await executeRequest({
    method: "POST",
    url: `shop/cart_send/?shop_id=${shop_id}&comment_person=${comment_person}&phone=${phone}`,
    body: {
      content: JSON.stringify(order),
      contentType: "application/json"
    },
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const getAllOrderNetworkRequest = async (token, refreshToken, page) => {
  token = await getUserToken();
  refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "GET",
    url: `profile/orders?curpage=${page}`,
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const getOrderDetailNetworkRequest = async (token, refreshToken, numberOrder) => {
  token = await getUserToken();
  refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "GET",
    url: `profile/orders/get/${numberOrder}`,
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};

export const getItemNetworkRequest = async (token, refreshToken, productId) => {
  token = await getUserToken();
  refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "GET",
    url: `shop/product/${productId}`,
    tokens: { access_token: token, refresh_token: refreshToken }
  });
};