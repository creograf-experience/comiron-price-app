import { getUserToken, getUserRefreshToken } from "../utils";
import { host } from "../constants";

export const dadataGetAddressRequest = async query => {
  const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
  const token = "af7ab672b89badf58ff6266b441a8bf099614483";

  let body = JSON.stringify({ query });

  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Token ${token}`);

  const res = await fetch(url, {
    method: "POST",
    headers,
    body
  });

  return res.json();
}

export const addUserAddressRequest = async address => {
  const url = "address/send";
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();

  const headers = new Headers();
  headers.append("Content-Type", "multipart/form-data");
  headers.append("Access-token", token);
  headers.append("Refresh-token", refreshToken);

  const body = new FormData();

  Object.keys(address).forEach(key => {
    body.append(key, address[key]);
  });

  const res = await fetch(`${host}/${url}`, {
    method: "POST",
    headers,
    body
  });

  return res.json();
}
