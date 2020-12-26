import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { verticalScale, scale } from "react-native-size-matters";

import { hostImages } from "../../../constants";
import { Container } from "../../../components/Price";


export class ShopList extends PureComponent {
  constructor(props) {
    super(props);
  }

  goToShopInfo = () => {
    const { shop, goToShopInfo } = this.props;

    goToShopInfo(shop);
  };

  render() {
    const { shop } = this.props;
    return (
      <Container
        style={{
          shadowOffset: {width: 5, height: 0},
          shadowColor: "rgba(0, 0, 0, 0.05)",
          shadowRadius: 5,shadowOpacity: 1,
        }}
        isViewed={true}
      >
        <TouchableOpacity
          style={{ width: "100%", height: verticalScale(60) }}
          onPress={this.goToShopInfo}
        >
          <View style={styles.contactInfo}>
            <Image
              style={{
                height: verticalScale(60),
                width: verticalScale(60),
                borderRadius: verticalScale(30),
                marginRight: scale(15)
              }}
              source={{ uri: `${hostImages}${shop.thumbnail_url}` }}
            />
            <Text
              style={{ flex: 1, fontSize: 17, fontWeight: "bold" }}
              numberOfLines={1}
            >
              {shop.name}
            </Text>
          </View>
        </TouchableOpacity>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  contactInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: verticalScale(16),
    paddingRight: scale(15),
  },
});
