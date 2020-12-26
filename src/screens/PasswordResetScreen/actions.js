import { executeRequest } from "../../utils";

export const sendMailRequest = (email) => {
  const body = new FormData();
  body.append("email", email);

  return executeRequest({
    method: "POST",
    url: "profile/forgotAJAX",
    body: {
      content: body,
      contentType: "multipart/form-data",
    },
  });
};