import {
  executeRequest,
  getUserProfile,
} from "../utils";

export const fetchNotifications = async curpage => {
  const user = await getUserProfile();
  const userId = user.split("~~")[0];

  return await executeRequest({
    method: "GET",
    url: `shop/pushes/${userId}?curpage=${curpage}`
  });
};
