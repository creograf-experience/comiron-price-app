import React, { Component } from "react";
import {
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { scale } from "react-native-size-matters";

import {
  editClientRequest,
  fetchAllShopClients,
} from "../../networkers";
import { setClients } from "../../actions";

import {
  colors,
  hostImages,
} from "../../constants";

import {
  Spinner,
  PriceDetailHeader,
  IconButton,
} from "../../components";
import {
  MyContentWrapper,
  MyAvatar,
  MyInfo,
  MyInfoItem,
} from "../MyProfileScreen/components";

import { TagList } from "../MyShopClientsScreen/components/TagList";
import SetDiscount from "./components/SetDiscount";

import notAvailable from "../../../assets/not-available.png";

import { strings } from "../../../locale/i18n";

const windowHeight = Dimensions.get('window').height;

class ClientInfoScreen extends Component {
  state = {
    discount: "",
    selectedTags: [],
    loading: false,
  };

  render() {
    const { client, tags } = this.props.navigation.state.params;
    const { discount, loading } = this.state;

    if (loading) return <Spinner />

    return (
      <MyContentWrapper>
        <ScrollView
          showsVerticalScrollIndicator={ false }
        >
          <View
            style={{
              width: "100%",
              height: scale(100),
              backgroundColor: colors.colorPrimary,
              alignItems: "center",
              marginBottom: 65,
            }}
          >
            <View
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 10,
              }}
            >
              {
                client.thumbnail_url
                  ? <MyAvatar source={{ uri: `${hostImages}${client.thumbnail_url + "?" + new Date()}` }} />
                  : <MyAvatar source={ notAvailable } />
              }
            </View>
          </View>

          <MyInfo style={{ justifyContent: "flex-start" }}>
            <MyInfoItem value={client.last_name + " " + client.first_name} />
            <MyInfoItem value={client.email} />
            <MyInfoItem value={client.phone} />
          </MyInfo>

          <SetDiscount
            value={discount}
            handleValueChange={this.handleValueChange}
            containerStyle={{ marginBottom: 30, justifyContent: "center" }}
          />

          <MyInfoItem value={strings("profile.tags")} />
          <TagList
            tags={tags}
            defaultSelected={
              client.tags && client.tags.filter(tag => tag.ismy).map(tag => tag.id)
            }
            onTagPress={this.handleTagPress}
            containerStyle={{ marginVertical: 10 }}
          />
        </ScrollView>
      </MyContentWrapper>
    );
  }

  componentDidMount() {
    const { client } = this.props.navigation.state.params;
    this.setState({ discount: String(client.discounthidden) });

    this.props.navigation.setParams({ editClient: this.editClient });
  }

  handleValueChange = newValue => this.setState({ discount: newValue });

  handleTagPress = selectedTags => this.setState({ selectedTags });

  editClient = async () => {
    try {
      const { shopId, client, updateFilteredClients } = this.props.navigation.state.params;
      const { discount, selectedTags } = this.state;

      this.setState({ loading: true });

      let body = {
        discounthidden: discount,
        tag_id: selectedTags,
      };

      await editClientRequest(shopId, client.id, body);

      const { clients } = await fetchAllShopClients(shopId);
      this.props.setClients(clients);

      // const currentClient = clients.find(item => item.id === client.id);
      // this.props.navigation.setParams({ client: currentClient });

      updateFilteredClients(clients);
      this.props.navigation.goBack();

      this.setState({ loading: false });

    } catch (err) {
      console.warn(err);
      this.setState({ loading: false });
    }
  };
};

ClientInfoScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => (
    <PriceDetailHeader
      title={strings("profile.singleClient")}
      color={colors.textColorPrimary}
    />
  ),

  headerLeft: () => (
    <IconButton
      name={"ios-arrow-back"}
      stylesContainer={
        Platform.OS === "ios" ? {
          height: "100%",
          alignItems: "center",
          marginBottom: 5,
        }
        : {}
      }
      stylesIcon={{
        fontSize: 30,
        marginLeft: 25,
        color: colors.textColorPrimary,
        marginTop: Platform.OS === "android" ? 15 : windowHeight > 667 ? 0 : 15,
      }}
      onPress={() => navigation.goBack()}
    />
  ),

  headerRight: () => (
    <TouchableOpacity
      style={{ marginRight: 25, padding: 5 }}
      onPress={navigation.state.params.editClient}
    >
      <Image
        style={{ width: 25, height: 20, marginBottom: Platform.OS === "ios" ? 15 : 0 }}
        source={require("../../../assets/check-white.png")}
      />
    </TouchableOpacity>
  ),

  headerStyle: {
    backgroundColor: colors.colorPrimary,
    height: 80,
    // marginTop: Platform.OS === "ios" ? 20 : 0,
    shadowColor: "transparent",
    shadowRadius: 0,
    shadowOffset: {
      height: 0
    },
    elevation: 0,
    borderBottomWidth: 0,
  },
});

const connectedScreen = connect(null, { setClients })(ClientInfoScreen);
export { connectedScreen as ClientInfoScreen };
