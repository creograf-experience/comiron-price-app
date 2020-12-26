import { executeRequest, getUserToken, getUserRefreshToken } from "../utils";

export const calculateRupostCostRequest = async (shopPostalCode, userPostalCode, orderWeight) => {
  const urls = [
    `https://tariff.pochta.ru/tariff/v1/calculate?json&object=23030&from=${shopPostalCode}&to=${userPostalCode}&weight=${orderWeight}`,
    `https://tariff.pochta.ru/tariff/v1/calculate?json&object=4030&from=${shopPostalCode}&to=${userPostalCode}&weight=${orderWeight}`,
    `https://tariff.pochta.ru/tariff/v1/calculate?json&object=47030&from=${shopPostalCode}&to=${userPostalCode}&weight=${orderWeight}`
  ];

  let promises = urls.map(url => fetch(url));
  promises = await Promise.all(promises);

  promises = promises.map(promise => promise.json());
  return Promise.all(promises);
}

export const DpdCitySearchRequest = async text => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();

  let res = await executeRequest({
    method: "GET",
    url: `dpdru/citysearch?query=${text}`,
    tokens: { access_token: token, refresh_token: refreshToken },
  });

  if (res.suggestions && res.suggestions.length > 20) {
    res.suggestions = res.suggestions.slice(0, 20);
  }

  return res;
}


export const calculateDpdCostRequest = async (type, order) => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();

  let params = new URLSearchParams();

  params.append("deliverycity", order.deliverycity);
  params.append("pickupcity", order.pickupcity);
  params.append("deliveryzip", order.deliveryzip);
  params.append("pickupzip", order.pickupzip);
  params.append("weight", order.weight);
  params.append("volume", order.volume);
  params.append("w", order.w);
  params.append("h", order.h);
  params.append("d", order.d);
  params.append("declaredValue", order.declaredValue);
  params.append("cityid", order.cityid);

  const headers = new Headers();

  headers["Access-token"] = token;
  headers["Refresh-token"] = refreshToken;

  const res = await fetch(`https://comironserver.comiron.com/dpdru/${type}?${params.toString()}`, {
    method: "GET",
    headers
  })

  return +await res.text();
}

export const getShopPOIsRequest = async id => {
  const token = await getUserToken();
  const refreshToken = await getUserRefreshToken();

  return executeRequest({
    method: "GET",
    url: `shop/pointofissue/${id}`,
    tokens: { access_token: token, refresh_token: refreshToken },
  });
}
