import React from "react";

import { hostImages } from "../../../constants";
import { ShopLogo } from "../../../components/index";
import notAvailable from "../../../../assets/not-available.png";

export const Photo = ({ shop }) => {
  return (
    shop.thumbnail_url
      ? <ShopLogo source={{ uri: `${hostImages}${shop.thumbnail_url}` }} />
      : <ShopLogo source={notAvailable} />
  );
};
