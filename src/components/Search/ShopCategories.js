import React, { Component } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import { IconButton } from "../../components";
import { colors } from "../../constants";

export class ShopCategories extends Component {
  state = {
    showBackButton: false,
    levels: [],
    categoryIdsHistory: [],
  }

  componentDidMount() {
    const { levels } = this.state;
    const { groups } = this.props;
    levels.push(groups);
    this.setState({ levels });
  }

  handleBackButtonPress = () => {
    const { levels, categoryIdsHistory } = this.state;
    const { onCategorySearch, resetProducts } = this.props;

    categoryIdsHistory.pop();
    levels.pop();
    this.setState({ levels, categoryIdsHistory });

    if (levels.length === 1) {
      this.setState({ showBackButton: false });
      resetProducts();
      return;
    }

    const parentCategory = categoryIdsHistory[categoryIdsHistory.length - 1];
    onCategorySearch(parentCategory, "");
  };

  handleCategoryPress = category => {
    const { levels, categoryIdsHistory } = this.state;
    const { onCategorySearch } = this.props;

    onCategorySearch(category.id, "");

    if (!category.subs || !Object.values(category.subs).length) {
      return;
    }

    categoryIdsHistory.push(category.id);
    levels.push(Object.values(category.subs));
    this.setState({
      levels,
      categoryIdsHistory,
      showBackButton: true,
    });

    this.flatListRef.scrollToIndex({ animated: false, index: 0 });
  };

  render() {
    const { showBackButton, levels } = this.state;

    return (
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
        <FlatList
          style={{ height: 40, marginRight: 10, marginLeft: 10 }}
          ref={ref => this.flatListRef = ref}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={levels[levels.length - 1]}
          renderItem={({ item }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                onPress={() => this.handleCategoryPress(item)}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: colors.colorPrimary,
                }}
              >
                <Text style={{ fontSize: 16 }}>{ item.name }</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
        />

        <IconButton
          name="ios-more"
          stylesIcon={{ fontSize: 30, marginRight: 10, color: colors.colorPrimary, paddingTop: 10 }}
          onPress={this.props.goCategoryScreen}
          hitSlop={false}
        />
      </View>
    );
  }
};
