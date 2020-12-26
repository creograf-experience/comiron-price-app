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

export class ShopFilter extends Component {
  state = {
    showBackButton: false,
    levels: [],
    categoryIdsHistory: [],
  }

  componentDidMount() {
    const { levels } = this.state;
    const { properties } = this.props;
    levels.push(properties);
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
    onCategorySearch("", parentCategory);
  };

  handleCategoryPress = category => {
    const { levels, categoryIdsHistory } = this.state;
    const { onCategorySearch } = this.props;
    // check for the first time parent property then its' values
    if (category.shop_id) {
      const value = category.values.find(v => v);
      const property = value.property_id + "_" + value.value;
      onCategorySearch("", property);
    }
    if (!category.shop_id) {
      const property = category.property_id + "_" + category.value;
      onCategorySearch("", property);
    }
    if (!category.values || !Object.values(category.values).length) {
      return;
    }

    categoryIdsHistory.push(category.property_id);
    levels.push(Object.values(category.values));
    this.setState({
      levels,
      categoryIdsHistory,
      showBackButton: true,
    });
    this.flatListRef.scrollToIndex({ animated: false, index: 0 });
  };

  render() {
    const { showBackButton, levels } = this.state;
    const { groups } = this.props;

    return (
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "#D8D8D8"
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
                <Text style={{ fontSize: 16 }}>{ item.value ? item.value : item.property_name }</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id ? item.id : item.property_id}
          ItemSeparatorComponent={ () => <View style={{ width: 20 }} /> }
        />
        {
          !groups.length
            ? <IconButton
                name="ios-more"
                stylesIcon={{ fontSize: 30, marginRight: 10, color: colors.colorPrimary, paddingTop:10 }}
                onPress={this.props.goCategoryScreen}
                hitSlop={false}
              />
            : null
        }  
      </View>
    );
  }
}
