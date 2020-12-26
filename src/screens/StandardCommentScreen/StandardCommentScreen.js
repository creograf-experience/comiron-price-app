import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  Platform,
  View,
  Text,
  Dimensions,
} from "react-native";

import { colors } from "../../constants";
import { strings } from "../../../locale/i18n";
import { PriceDetailHeader, IconButton, ContainerWrapper, Spinner } from "../../components";
import { Separator } from "../AllOrderScreen/components";
import { AddComment } from "./components";
import { getUserToken, getUserRefreshToken } from "../../utils";
import { TouchableOpacity } from "react-native-gesture-handler";

const windowHeight = Dimensions.get('window').height;

class StandardCommentScreen extends Component {
  state = {
    isVisible: false,
    standardComment: "",
    allComment: [],
    fromOrder: false,
    loading: true,
  };
  async componentDidMount (){
    this.props.navigation.setParams({ showModal: this.showModal })
    const token = await getUserToken();
    const refreshToken = await getUserRefreshToken();
    await this.props.checkStandardComment(token, refreshToken);
    if (this.props.navigation.state.params !== undefined) {
      this.setState({ fromOrder: this.props.navigation.state.params.fromOrder })
    }
    if (this.props.standardComment) {
      const allComment = this.props.standardComment.split("~~").map(el => ({ text: el }));
      this.setState({ allComment })
    }
    this.setState({ loading: false })
  }

  showModal = () => this.setState({ isVisible: true });

  hideModal = () => this.setState({ isVisible: false, standardComment: "" });

  saveComment = async() => {
    const { standardComment, allComment } = this.state;
    if (standardComment.length) {
      this.setState({ allComment: [...allComment, {text: standardComment} ] });
      this.hideModal();
      const postComment=[...allComment, {text: standardComment}].map(el => el.text).join("~~");
      await this.props.saveComment(postComment);
    }
  };

  deleteComment = async (item) => {
    const notDeleteComment = this.state.allComment.filter(el => el.text !== item.text);
    this.setState({ allComment:notDeleteComment });
    const postComment = notDeleteComment.map(el => el.text).join("~~");
    await this.props.saveComment(postComment);
  };

  renderItem = ({ item }) => {
    const { fromOrder } = this.state;
    return (
      <View style={[ styles.layoutComment, { shadowOffset: {width: 5, height: 0} } ]}>
        {
          fromOrder ? (
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.state.params.addStandardComment({ comment: item.text }),
                  this.props.navigation.goBack()
                }}
              >
                <Text style={{ fontSize: 16, marginTop: 2 }}>{item.text}</Text>
              </TouchableOpacity>
              <IconButton
                name={"ios-trash"}
                stylesIcon={styles.deleteBtnStyle}
                onPress={() => this.deleteComment(item)}
                hitSlop={{ left: 0, top: 0, right: 0, bottom: 0 }}
              />
            </View>
          )
          : (
            <View style={styles.container}>
              <Text style={{ fontSize: 16, marginTop: 2 }}>{item.text}</Text>
              <IconButton
                name={"ios-trash"}
                stylesIcon={styles.deleteBtnStyle}
                onPress={() => this.deleteComment(item)}
                hitSlop={{ left: 0, top: 0, right: 0, bottom: 0 }}
              />
            </View>
          )
        }

      </View>
    );
  };

  render() {
    const { standardComment, allComment, isVisible, loading } = this.state;

    if (loading) {
      return <Spinner backgroundColor={colors.background}/>;
    }

    return (
      <ContainerWrapper>
        <FlatList
          style={{ paddingTop: 5 }}
          data={allComment}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <Separator/>}
        />
        <AddComment
          isVisible={isVisible}
          closeModal={()=>this.hideModal()}
          onChangeText={standardComment=>this.setState({ standardComment })}
          value={standardComment}
          onPressSave={()=>this.saveComment()}
        />
      </ContainerWrapper>
    );
  }
}

StandardCommentScreen.navigationOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
    // marginTop: Platform.OS === "ios" ? 20 : 0
  },
  headerTitle: () => (
    <PriceDetailHeader
      color="white"
      title={strings("profile.standartComment")}
      flag={"long"}
    />
  ),
  headerLeft: () => (
    <IconButton
      name={"ios-arrow-back"}
      stylesContainer={Platform.OS === "ios" ? styles.iosHeaderCenter : {}}
      stylesIcon={styles.arrowBack}
      onPress={() => navigation.goBack()}
    />
  ),
  headerRight: () => (
    <IconButton
      name={"ios-add-circle-outline"}
      stylesContainer={[ Platform.OS === "ios" ? styles.iosHeaderCenter : {marginRight: 20, padding: 5} ]}
      stylesIcon={styles.iconList}
      onPress={() => navigation.state.params.showModal()}
    />
  )
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  deleteBtnStyle: {
    fontSize: 24,
    color: colors.colorPrimary,
  },
  arrowBack: {
    fontSize: 30,
    marginLeft: 25,
    color: "#fff",
    marginTop: Platform.OS === "android" ? 20 : windowHeight > 667 ? 0 : 15,
  },
  iconList : {
    fontSize: 30,
    marginRight: 10,
    color: "#fff",
    marginTop: Platform.OS === "android" ? 18 : windowHeight > 667 ? 0 : 15,
  },
  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
    marginBottom: 5,
    marginRight: 15,
  },
  layoutComment: {
    paddingLeft: 20,
    paddingRight: 20,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowRadius: 5,
    shadowOpacity: 1,
    backgroundColor: colors.textColorPrimary,
    paddingTop: 5,
    paddingBottom: 5,
  },
});

export default StandardCommentScreen;
