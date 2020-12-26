import {
  executeRequest,
} from "../utils";

export const getAllShopsFromCityNetworkRequest = async city => {
  return await executeRequest({
    method: "GET",
    url: `shop/getshopsfromcity?city=${city}`,
  })
};

export const getAllRecommendedShops = async () => {
  return await executeRequest({
    method: "GET",
    url: `central/malls`,
  })
};

export const getPopularProducts = async () => {
  return await executeRequest({
    method: "GET",
    url: `central/products`,
  })
};