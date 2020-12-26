import React, { PureComponent } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { verticalScale } from "react-native-size-matters";
import { hostImages, colors } from "../../../constants";

export class Banner extends PureComponent {
  constructor(props) {
    super(props);
  }

  renderItem = ({ item }) => {
    return (
      item.img ?
        <TouchableOpacity
          onPress={() => this.props.viewShop(item.link)}>
          <Image
            style={styles.bannerImg}
            source={{ uri: `${hostImages}/images/advert/${item.img}` }}
          />
        </TouchableOpacity>
        :
        <View></View>
    );
  }

  render() {
    const { banners } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={banners}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === "ios" ? verticalScale(140) : verticalScale(200),
  },
  bannerImg: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.background,
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? verticalScale(140) : verticalScale(200),
    width: Dimensions.get("window").width,
    resizeMode: "contain",
  },
});