import {
  executeRequest,
  getUserProfile,
  getUserToken,
  getUserRefreshToken,
} from "../utils";


export const getUserShopsNetworkRequest = async (userID = null) => {
  const user = await getUserProfile();
  userID = user.split("~~")[0];

  return await executeRequest({
    method: "GET",
    url: `profile/shops/${userID}`,
  })
};

export const getAllShopsNetworkRequest = text => {
  return executeRequest({
    method: "GET",
    url: `search?q=${text}&for=shop`,
  })
};

export const getShopPricesNetworkRequest = (shopID, i, userID) => {
  return executeRequest({
    method: "GET",
    url: `price/userprices/?user_id=${userID}&page=${i}&shop_id=${shopID}`,
  })
};

export const getShopInfoNetworkRequest = shopID => {
  return executeRequest({
    method: "GET",
    url: `shop/${shopID}`,
  })
};

export const getShopGroupNetworkRequest = (groupID, page) => {
  return executeRequest({
    method: "GET",
    url: `shop/group/${groupID}?curpage=${page}&style=ajax`,
  })
};

export const getShopProductInfoNetworkRequest = productID => {
  return executeRequest({
    method: "GET",
    url: `shop/product/${productID}`,
  })
};

export const addClientNetworkRequest = (shopID, token, refreshToken) => {
  return executeRequest({
    method: "GET",
    url: `shop/addclient/${shopID}`,
    tokens: { access_token: token, refresh_token: refreshToken },
  })
};

export const deleteShopNetworkRequest = (shopID, token, refreshToken) => {
  return executeRequest({
    method: "GET",
    url: `home/removeshop/${shopID}`,
    tokens: { access_token: token, refresh_token: refreshToken },
  })
};

export const showAllShopsNetworkRequest = () => {
  return executeRequest({
    method: "GET",
    url: "central/malls",
  })
};

export const postCallManagerNetworkRequest = (person) => {
  return executeRequest({
    method: "POST",
    url: `shop/callmanager`,
    body: {
      content: JSON.stringify(person),
      contentType: "application/json"
    }
  })
};

export const fetchUserShop = async () => {
  const user = await getUserProfile();
  const userId = user.split("~~")[0];

  return await executeRequest({
    method: "GET",
    url: `shop/myshop/${userId}`
  });
};

export const fetchShopClients = async (shopId, page = 0) => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "GET",
    url: `shop/clients/${shopId}?currpage=${page}`,
    tokens: { access_token: token, refresh_token: refreshToken },
  });
};

export const fetchAllShopClients = async shopId => {
  const makeArrayFromObject = obj =>
    Object.keys(obj).map(item => obj[item]);

  const res = await fetchShopClients(shopId);
  let clientsRequests = makeArrayFromObject(res.client_requests);
  let clients = makeArrayFromObject(res.clients);

  if (res.pages <= 1) return { clients, clientsRequests };

  for (let page = 2; page <= res.pages; page++) {
    const response = await fetchShopClients(shopId, page);
    clients = [...clients, ...makeArrayFromObject(response.clients)];
  }

  return { clients, clientsRequests };
};

export const acceptClientRequest = async (shopId, clientId) => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "GET",
    url: `shop/acceptclient/${shopId}/${clientId}`,
    tokens: { access_token: token, refresh_token: refreshToken },
  });
};

export const rejectClientRequest = async (shopId, clientId) => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "GET",
    url: `shop/rejectclient/${shopId}/${clientId}`,
    tokens: { access_token: token, refresh_token: refreshToken },
  });
};

export const deleteClientRequest = async (shopId, clientId) => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();

  return await executeRequest({
    method: "GET",
    url: `shop/removeclient/${shopId}/${clientId}`,
    tokens: { access_token: token, refresh_token: refreshToken },
  });
};

export const editClientRequest = async (shopId, clientId, body) => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();

  const formData = new FormData();
  for (const key of Object.keys(body)) {
    formData.append(`${key}`, `${body[key]}`);
  }

  return await executeRequest({
    method: "POST",
    url: `shop/client_edit/${shopId}/${clientId}`,
    tokens: { access_token: token, refresh_token: refreshToken },
    body: {
      content: formData,
      contentType: "multipart/form-data"
    }
  });
};
