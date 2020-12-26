import React, {PureComponent} from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { colors, hostImages } from "../../../constants";
import { verticalScale } from "react-native-size-matters";

export class Carousel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      width: Dimensions.get("window").width,
      timer: 0,
      itemWidth: Dimensions.get("window").width,
    };
  }

  scrollWithTimeout(prevTimer = 0) {
    setTimeout(() => {
      let newTimer = this.state.timer;
      if (prevTimer < newTimer) {
        newTimer = newTimer === this.state.items.length - 1 ? newTimer - 1 : newTimer + 1;
      } else {
        newTimer = newTimer === 0 ? newTimer + 1 : newTimer - 1;
      }
      let newX = newTimer * this.state.itemWidth;
      this.setState({
        timer: newTimer
      });
      this.scroller.scrollTo({x: newX, y: 0, animated: true});
    }, 2000);
  }

  componentDidMount() {
    this.scrollWithTimeout();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.timer !== prevState.timer) {
      this.scrollWithTimeout(prevState.timer);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          ref={scroller => { this.scroller = scroller; }}
          horizontal={true}
          contentContainerStyle={{ ...styles.scrollView, width: `${100 * this.state.items.length}%` }}
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={(w, h) => {
            this.setState({ width: w });
          }}
          onScroll={data => {
            this.setState({
              width: data.nativeEvent.contentSize.width,
            });
          }}
          scrollEventThrottle={16}
          pagingEnabled
          decelerationRate="fast"
        >
          {this.state.items.map((item, index) => (
            <TouchableOpacity key={index} style={{ display: "flex", flexDirection: "column" }}
              onPress={() => this.props.viewShop(item.link)}>
              <Image
                style={styles.bannerImg}
                source = {{ uri: `${hostImages}/images/advert/${item.img}` }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === "ios" ? verticalScale(140) : verticalScale(200),
  },
  scrollView: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
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