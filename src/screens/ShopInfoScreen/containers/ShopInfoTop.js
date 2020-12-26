import React, { PureComponent } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import * as MailComposer from "expo-mail-composer";

import {
  ShopInfoTopWrapper,
  ContactInfoWrapper,
  ShopInfoTopText,
} from "../components";
import { strings } from "../../../../locale/i18n";

export class ShopInfoTop extends PureComponent {
  state = {
    followButtonTapped: false,
  };

  openEmail = email => {
    MailComposer.composeAsync({
      recipients: [email]
    });
  };

  render() {
    const { followButtonTapped } = this.state;

    return (
      <View>
        <ShopInfoTopWrapper>
          <ContactInfoWrapper>
            <View>
              <Image
                style={{
                  height: scale(120),
                  width: scale(120),
                  borderRadius: scale(60)
                }}
                source={require("../../../../assets/icon.png")}
              />
            </View>
            <View
              style={{
                width: "65%",
                height: "90%",
                justifyContent: "center",
                paddingLeft: scale(20)
              }}
            >
              <ShopInfoTopText style={{ fontWeight: "bold", fontSize: 22 }}>
                {strings("shopInfoScreen.contact")}
              </ShopInfoTopText>
              <ShopInfoTopText>+7 (351) 225-42-42</ShopInfoTopText>
              <TouchableOpacity
                onPress={() => {
                  this.openEmail("anton.galleon@gmail.com");
                }}
              >
                <ShopInfoTopText
                  style={{
                    color: Platform.OS === "ios" ? "blue" : "black",
                    textDecorationLine:
                      Platform.OS === "ios" ? "underline" : "none"
                  }}
                >
                  anton.galleon@gmail.com
                </ShopInfoTopText>
              </TouchableOpacity>
            </View>
          </ContactInfoWrapper>
          <TouchableOpacity
            style={{
              width: "60%",
              height: verticalScale(40),
              borderColor: "black",
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              this.setState({ followButtonTapped: !followButtonTapped });
            }}
          >
            <Text style={{ fontSize: 16 }}>
              {followButtonTapped ? strings("shopInfoScreen.unSub") : strings("shopInfoScreen.sub")}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              alignSelf: "flex-start",
              paddingVertical: verticalScale(15),
              paddingLeft: scale(15),
            }}
          >
            {strings("shopInfoScreen.price")}
          </Text>
        </ShopInfoTopWrapper>
      </View>
    );
  }
}
