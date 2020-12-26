import { executeRequest } from "../utils";

export const registerNetworkRequest = (
  email,
  password,
  repeatPassword,
  firstName,
  lastName
) => {
  const body = new FormData();

  body.append("register_email", email);
  body.append("register_password", password);
  body.append("register_password2", repeatPassword);
  body.append("register_first_name", firstName);
  body.append("register_last_name", lastName);
  body.append("refers", "false");
  body.append("link", "");

  return executeRequest({
    method: "POST",
    url: `register`,
    body: {
      content: body,
      contentType: "multipart/form-data"
    }
  });
};
