import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  FlatList,
  Dimensions,
} from "react-native";

import { Button } from "../../containers";
import  { colors } from "../../constants";
import { strings } from "../../../locale/i18n";

import {
  PriceDetailHeader,
  IconButton,
} from "../../components";

const windowHeight = Dimensions.get('window').height;

export default class CategoryScreen extends Component {
  state = {
    groups: this.props.navigation.state.params.groups,
    categoryIdsHistory: [],
    propertySelfId: [],
    properties: this.props.navigation.state.params.properties,
    propertyValuesHistory: [],
  };

  chooseGroup = id => {
    this.setState({ categoryIdsHistory: [] });
    this.setState({ categoryIdsHistory: id });
  };

  // function for multiple properties choice
  chooseProp = (item) => {
    const existingSelfId = this.state.propertySelfId.includes(item.id);

    let propertySelfId = this.state.propertySelfId;
    let propertyValuesHistory = this.state.propertyValuesHistory;
    let IdValSum = null;

    IdValSum = item.property_id + '_' + item.value;

    if (!existingSelfId) {
      propertyValuesHistory = [...propertyValuesHistory, IdValSum]
      propertySelfId = [...propertySelfId, item.id];

      let emptyString = '';
      let str = emptyString.concat(propertyValuesHistory.map(x => `&property[]=${x}`));
      let propertyString = str.replace(/,/g, "");

      this.setState({
        propertySelfId,
        propertyValuesHistory,
        propertyString,
      });
      return;
    }

    propertyValuesHistory = propertyValuesHistory.filter(resVal => resVal !== IdValSum);
    propertySelfId = propertySelfId.filter(selectSelfId => selectSelfId !== item.id);

    let emptyString = '';
    let str = emptyString.concat(propertyValuesHistory.map(x => `&property[]=${x}`));
    let propertyString = str.replace(/,/g, "");

    this.setState({
      propertySelfId,
      propertyValuesHistory,
      propertyString,
    });
  };

  renderItem = ({ item }) => {
    const { categoryIdsHistory } = this.state;
    if (item.subs === null) {
      return (
        <View style={{ marginLeft: 10, alignItems: "flex-start", marginTop: 10, marginRight: 10 }}>
          <TouchableOpacity 
            onPress={() => this.chooseGroup(item.id)}
          >
            <Text style={[ styles.itemCategory, { backgroundColor: categoryIdsHistory === item.id ? colors.colorPrimary : colors.background } ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        </View>
      );
    };
    return (
      <View>
        <View style={{ marginLeft: 10, alignItems: "flex-start", marginTop: 10, marginRight: 10}}>
          <TouchableOpacity
            onPress={() => this.chooseGroup(item.id)}
          >
            <Text style={[ styles.itemCategory, { backgroundColor: categoryIdsHistory === item.id ? colors.colorPrimary : colors.background } ]}>
              {item.name}
            </Text>   
          </TouchableOpacity>
        </View>

        <FlatList
          style={{ marginLeft: 30 }}
          extraData={this.state}
          data={item.subs === null ? [] : Object.values(item.subs)}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };

  renderPropsNameItem=({ item }) => {
    const value = item.values;

    return (
      <View>
        <View style={{ marginLeft: 10, alignItems: "flex-start", marginTop: 10, marginRight: 10}}>
         <Text style={styles.itemText}>{item.property_name}</Text>
        </View>

        <FlatList
          style={{ marginLeft: 30 }}
          extraData={this.state}
          data={value}
          renderItem={this.renderPropsItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };

  renderPropsItem=({ item }) => {
    const { propertySelfId } = this.state;
    const isSelected = propertySelfId.includes(item.id);

    return (
      <View>
        <View style={{ marginLeft: 10, alignItems: "flex-start", marginTop: 10, marginRight: 10}}>
          <TouchableOpacity
            onPress={()=>this.chooseProp(item)}
          >
            <Text style={
              [
                styles.itemCategory,
                {
                  backgroundColor: isSelected ? colors.colorPrimary : colors.background
                }
              ]
            }>
              { item.value }
            </Text>   
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const {
      categoryIdsHistory,
      groups,
      properties,
      propertySelfId,
      propertyString
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        {
          groups && groups.length ? (
            <FlatList
              style={{ marginBottom: 10, paddingBottom: 10 }}
              data={groups}
              extraData={this.state}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
            />
          ) : null
        }
        {
          properties && properties.length ? (
            <FlatList
              style={{ marginBottom: 10 }}
              data={properties}
              extraData={this.state}
              renderItem={this.renderPropsNameItem}
              keyExtractor={item => item.property_id}
            />
          ) : null
        }
        
        {
          categoryIdsHistory.length !== 0 ? 
          (
            <View style={{ alignItems: "center", marginBottom: 10, marginTop: 10 }}>
              <Button
                fontSize="16"
                text={strings("priceDetail.show")}
                onPress={() => {
                  navigation.state.params.onCategorySearch(categoryIdsHistory, "", true);
                  navigation.goBack();
                }}
              />
            </View>  
          )
          : propertySelfId.length !== 0 ?
          (
            <View style={{ alignItems: "center", marginBottom: 10, marginTop: 10 }}>
              <Button
                fontSize="16"
                text={strings("priceDetail.show")}
                onPress={() => {
                  navigation.state.params.onCategorySearch("", propertyString);
                  navigation.goBack();
                }}
              />
            </View>  
          )
          : null
        }
      </View>
    );
  }
}

CategoryScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => ( <PriceDetailHeader title={strings("priceDetail.filter")}/> ),
  headerStyle: {
    backgroundColor: colors.textColorPrimary,
    height: 80,
    // marginTop: Platform.OS === "ios" ? 20 : 0, 
    // color: "black",
  },
  headerTintColor: colors.textColorPrimary,
  headerLeft: () => (
    <IconButton
      name={"ios-arrow-back"}
      stylesContainer={ Platform.OS === "ios" ? styles.iosHeaderCenter : {} }
      stylesIcon={styles.arrowBack}
      onPress={() => navigation.goBack()}
    />
  ),
  // невидимый элемент, чтобы выровнять
  // текст заголовка по центру
  headerRight: () => (
    <View style={{ marginRight: 15 }} />
  ),
});

const styles = StyleSheet.create({
  arrowBack: {
    fontSize: 30,
    marginLeft: 25,
    color: "#8a8c9c",
    marginTop: Platform.OS === "android" ? 20 : windowHeight > 667 ? 0 : 15,
  },

  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  itemCategory: {
    borderWidth: 1,
    borderColor: colors.colorPrimary,
    fontSize: 16,
    padding: 5,
  },
  itemText : {
    fontSize: 16,
    marginLeft: 5,
  },
});