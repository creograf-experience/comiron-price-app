import { executeRequest } from "../utils";

export const productSearchRequest = (shopId, text, groupId = null, property = null, priceId = null, page = 0) => {
  const body = new FormData();
  body.append("shop_id", shopId)
  body.append("name", text);
  if (groupId) body.append("group_id", groupId);
  if (priceId) body.append("price_id", priceId);
  if (page) body.append("curpage", page);

  return executeRequest({
    method: "POST",
    url: `central/searchproduct/?${property ? `&property=${property}` : ""}`,
    body: {
      content: body,
      contentType: "multipart/form-data"
    }
  });
};