export const defaultConfig = {
  IP: "https://comironserver.comiron.com",
  hostImages: "https://comiron.com",
  tokenAccessName: "ComironPriceDevClientTokenAccess",
  tokenRefreshName: "ComironPriceDevClientTokenRefresh",
  chatIP:"http://chat.comiron.com"
};

export const host = `${defaultConfig.IP}`;
export const { tokenAccessName, tokenRefreshName } = defaultConfig;
export const hostImages = `${defaultConfig.hostImages}`;
export const hostChat = `${defaultConfig.chatIP}/api`;