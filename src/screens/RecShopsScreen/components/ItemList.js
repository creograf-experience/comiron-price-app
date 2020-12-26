import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { verticalScale, scale } from "react-native-size-matters";

import { hostImages, colors } from "../../../constants";


export class ItemList extends PureComponent {
  constructor(props) {
    super(props);
  }

  goToItemInfo = () => {
    const { item, goToItemInfo } = this.props;

    goToItemInfo(item);
  };

  render() {
    const { item } = this.props;
    return (
      item ?
        <TouchableOpacity
          style={styles.container}
          onPress={this.goToItemInfo}>

          <Image
            style={item.thumbnail_url ? styles.imageSet : styles.imageNotSet}
            source={item.thumbnail_url
              ?
                {uri: `${hostImages}${item.thumbnail_url}`}
              :
                require("../../../../assets/camera.png")
            }/>

          <Text style={{ flex: 1, height: 20, textAlign: "center" }}>
            {item && item.name ? item.name.length > 16 ? item.name.substr(0, 16) : item.name : "noname"}
          </Text>

        </TouchableOpacity>
      :
        <View></View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    height: verticalScale(100),
    margin: 1,
    width: scale(120),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.textColorPrimary,
    paddingTop: 10,
    paddingBottom: 0,
  },
  imageSet: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: verticalScale(25),
    marginRight: scale(15),
    flex: 1,
  },
  imageNotSet: {
    height: verticalScale(50),
    width: verticalScale(50),
    marginRight: scale(15),
    flex: 1,
  },
});