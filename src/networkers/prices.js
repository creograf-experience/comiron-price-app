import { executeRequest } from "../utils";

export const getPricesNetworkRequest = (userId, page) => {
  return executeRequest({
    method: "GET",
    url: `price/userprices/?user_id=${userId}&page=${page}`
  });
};

export const getCoopPricesNetworkRequest = (userId, page) => {
  return executeRequest({
    method: "GET",
    url: `price/userprices/?user_id=${userId}&page=${page}&is_sz=1`
  });
};

export const postViewedPricesNetworkRequest = (price_id, person_id) => {
  return executeRequest({
    method: "POST",
    url: `price/updatesaw/${price_id}`,
    body: {
      content: JSON.stringify(person_id),
      contentType: "application/json"
    }
  })
};