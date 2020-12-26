import React, { PureComponent } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
} from "react-native";
import { Separator } from "../../MainScreen/components";
import { verticalScale } from "react-native-size-matters";

export class ContainerList extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { headerText, textNoItem, data, renderItem, vertical} = this.props;

    return (
      data && data.length > 0
      ? (
        <View style = { vertical ? {} : { height: verticalScale(130) }}>
          <Text style={styles.recHeader}>{headerText}</Text>
          <Separator/>
            <View
              style={{height: '100%'}}
              nestedScrollEnabled = {true}>
              { vertical ?
                <FlatList
                  data = {data}
                  renderItem = {item => renderItem(item)}
                  numColumns = {3}
                /> :
                <FlatList
                  data = {data}
                  renderItem = {item => renderItem(item)}
                  horizontal = {true}
                />
              }
            </View>
          <Separator/>
        </View>
      ) :
      (
        <View style={styles.emptyWrapper}>
          <Text style={styles.recText}>{textNoItem}</Text>
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  recHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    margin: 1,
  },
  recText: {
    fontSize: 16,
    textAlign: "center",
  },
  emptyWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});