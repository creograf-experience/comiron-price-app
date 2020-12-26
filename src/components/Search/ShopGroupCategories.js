import React, { Component } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import { IconButton } from "../../components";
import { colors } from "../../constants";
import { strings } from "../../../locale/i18n";
import { Platform } from "@unimodules/core";

export class ShopGroupCategories extends Component {
  state = {
    showBackButton: false,
    levels: [],
    categoryIdsHistory: [],
    lastGroupName: "",
  }

  componentDidMount() {
    const { levels } = this.state;
    const { groups } = this.props;
    levels.push(groups);
    this.setState({ levels });
  }

  handleBackButtonPress = () => {
    const { levels, categoryIdsHistory } = this.state;
    const { onCategorySearch, onRefresh } = this.props;

    categoryIdsHistory.pop();
    levels.pop();
    this.setState({ levels, categoryIdsHistory, subGroup: true, lastGroupName: "" });

    if (levels.length === 1) {
      this.setState({ showBackButton: false, subGroup: false });
      onRefresh();
      return;
    }

    const parentCategory = categoryIdsHistory[categoryIdsHistory.length - 1];
    onCategorySearch(parentCategory);
  };

  handleCategoryPress = category => {
    const { levels, categoryIdsHistory } = this.state;
    const { onCategorySearch } = this.props;
    
    categoryIdsHistory.push(category.id);

    onCategorySearch(category.id);

    this.setState({
      levels,
      categoryIdsHistory,
    });

    this.flatListRef.scrollToIndex({ animated: false, index: 0 });
  }

  render() {
    const { showBackButton, levels, lastGroupName } = this.state;

    return (
      <View>
        {
          this.props.filter
            ? <IconButton
                stylesContainer={styles.container}
                name="ios-funnel"
                stylesIcon={styles.iconStyle}
                textName={strings("priceDetail.filter")}
                stylesText={styles.iconTextStyle}
                onPress={this.props.goCategoryScreen}
                hitSlop={false}
              />
            : null
        }
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "#D8D8D8",
          }}
        >
          {
            showBackButton ? (
              <TouchableOpacity
                onPress={this.handleBackButtonPress}
                style={{
                  alignSelf: "center",
                  marginLeft: 10,
                }}
              >
                <Image
                  source={require("../../../assets/category-back.png")}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            ) : null
          }
          {
            lastGroupName
              ? <Text style={{ fontSize: 18, marginLeft: 5, marginTop: 3 }}>{lastGroupName}</Text>
              : null
          }
          <FlatList
            ref={ref => this.flatListRef = ref}
            data={levels[levels.length - 1]}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.settings}
                onPress={() => this.handleCategoryPress(item)}
              >
                <Text style={styles.textStyle} >{item.name}</Text>
                <Ionicons name={"ios-arrow-forward"} style={styles.arrowStyle} />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 15,
  },
  iconStyle : {
    flexDirection: "row",
    fontSize: 30,
    marginRight: 10,
    color: colors.colorPrimary,
    paddingTop: 5,
  },
  iconTextStyle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  settings: {
    marginTop: 7,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: colors.textColorPrimary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textStyle: {
    flex: 1,
    alignSelf: "flex-start",
    fontSize: 18,
    marginLeft: 22,
    marginTop: Platform.OS === "ios" ? 3 : 0,
  },
  arrowStyle: {
    alignSelf: "flex-end",
    marginRight: 20,
    marginBottom: 3,
    fontSize: 18
  },
});
