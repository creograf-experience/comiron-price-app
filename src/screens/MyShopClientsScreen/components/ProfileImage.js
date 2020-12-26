import React from "react";
import { Image } from "react-native";

import { hostImages } from "../../../constants";
import notAvailable from "../../../../assets/not-available.png";

const ProfileImage = ({ url, style }) => {
  return (
      <Image
        style={[
          {
            width: 60,
            height: 60,
            borderRadius: 30,
            marginRight: 20,
          },
          style
        ]}
        source={ 
          url
            ? {uri: `${hostImages}${url + '?' + new Date()}`}
            : notAvailable
        }
      />
  );
};

export default ProfileImage;
