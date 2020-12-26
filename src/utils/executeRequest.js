import Constants from "expo-constants";
import { host } from "../constants";
import { Alert } from "react-native";
import { strings } from "../../locale/i18n";

export const executeRequest = async ({ method, url, body, tokens }) => {
  let status;
  let headers = {};
  let serverVersion = "";
  const appVersion = Constants.manifest.version;

  if (body) {
    headers["Content-Type"] = body.contentType;
  }

  if (tokens) {
    headers["Access-token"] = tokens.access_token;
    headers["Refresh-token"] = tokens.refresh_token;
  }
  
  return new Promise(async (resolve, reject) => {
    const response = await fetch(`${host}/${url}`, {
      method,
      headers,
      body: body ? body.content : undefined
    })
      .then(res => {
        if (res.status === 200) {
          status = res.status;

          // check and compare server & app versions
          serverVersion = res.headers.map.appversion;

          let strServer = serverVersion.split(".");
          let strApp = appVersion.split(".");

          !serverVersion ? console.log("Не корректный ответ запроса, проверьте правильность передаваемых значений!") : null;

          if (serverVersion) {
            for (let i = 0; i < strServer.length; i++) {
              for (let j = 0; j < strApp.length; j++) {
                if (i == j && strServer[i] > strApp[j]) {
                  Alert.alert(
                    strings("appVersion.alertTitle"),
                    strings("appVersion.alertBody"),
                  );
                  return;
                } else if (i == j && strServer[i] <= strApp[j]) {
                  continue;
                };
              };
            };
            return res.json();
          }
        }
      })
      .catch(e => console.log(e));

    switch (status) {
      case 200:
        resolve(response);
        break;
      default:
        reject(response);
        break;
    }
  });
};
