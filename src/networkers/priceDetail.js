import { executeRequest } from "../utils";

export const getPriceDetailNetworkRequest = (shopId, priceId, userId, groupId = null, property = null, page) => {
  return executeRequest({
    method: "GET",
    url: `price/pricedetail/?shop=${shopId}&price=${priceId}&user_id=${userId}${groupId ? `&group_id=${groupId}` : ""}${property ? `${property}` : ""}&page=${page}`
  });
};

