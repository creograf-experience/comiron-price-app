import React, { PureComponent } from "react";
import {
  StyleSheet,
  Platform,
  Alert,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Text,
  Dimensions,
} from "react-native";
import ActionSheet from "react-native-actionsheet";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

import { fetchUserShop, fetchAllShopClients } from "../../networkers";

import {
  Spinner,
  IconButton,
  PriceDetailHeader
} from "../../components";
import { Button } from "../../containers";
import { MyAvatar, MyInfoItem, MyInfo, MyContentWrapper } from "./components";
import notAvailable from "../../../assets/not-available.png";
import {
  colors,
  hostImages,
} from "../../constants";
import { getUserProfile } from "../../utils";
import { scale } from "react-native-size-matters";
import { strings } from "../../../locale/i18n";

const { width } = Dimensions.get("window");
const windowHeight = Dimensions.get('window').height;

class MyProfileScreen extends PureComponent {
  state = {
    user: {},
    photo: null,
    myShop: null,
    refreshing: false,
  };

  async componentDidMount() {
    const { getUserProfileRequest, getUserProfileSuccess } = this.props;
    getUserProfileRequest();

    const response = await fetchUserShop();
    if (response.shop != 0) {
      const clientsResponse = await fetchAllShopClients(response.shop.id);
      const { clients, clientsRequests } = clientsResponse;

      this.props.setClients(clients);
      this.props.setClientsRequests(clientsRequests);

      this.setState({ myShop: response.shop });
    }

    const userInString = await getUserProfile();
    const userInArray = userInString.split("~~"); // convert user profile from string to array
    const [id, firstName, lastName, email, image] = userInArray;
    const user = {
      id,
      firstName,
      lastName,
      email,
      image,
    };

    this.setState({
      user,
      photo: user.image,
    });

    getUserProfileSuccess();
  }

  renderModalConfirm = () => {
    Alert.alert(strings("profile.askExit"), "", [
      { text: strings("profile.no"), onPress: () => {}, style: "cancel" },
      { text: strings("profile.yes"), onPress: () => this.props.logOut() }
    ]);
  };

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  };

  _requestCameraRollPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({
      hasCameraRollPermission: status === "granted"
    });
  };

  pickPhoto = async () => {
    await this._requestCameraRollPermission();
    const { hasCameraRollPermission } = this.state;
    if (hasCameraRollPermission) {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [9, 16],
      });
      if (!result.cancelled) {
        this.setState({ result });
        this.uploadPhoto();
      }
    }
  };

  takePhoto = async () => {
    await this._requestCameraPermission();
    await this._requestCameraRollPermission();
    const { hasCameraPermission, hasCameraRollPermission } = this.state;
    if (hasCameraPermission && hasCameraRollPermission) {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [9, 16],
      });
      if (!result.cancelled) {
        this.setState({ result });
        this.uploadPhoto();
      }
    }
  };

  // 1. Upload image
  uploadPhoto = () => {
    const { sendPhoto } = this.props;
    const { result } = this.state;
    const folder = "/images/people/";

    let photo = new FormData();
    let avatar = {
      uri: result.uri,
      name: "image.jpg",
      type: "image/jpeg",
    };

    photo.append("Filedata", avatar);
    photo.append("folder", folder);

    sendPhoto(photo);
    setTimeout(() => {this.savePhoto()}, 1300);
  };

  // 2. Save image
  savePhoto = () => {
    const { savePhoto, addPhoto } = this.props;
    const { id } = this.state.user;
    const { result } = this.state;
    const folder = "/images/people/";

    let data = new FormData();

    data.append("imgcrop[0][name]", "image.jpg");
    data.append("imgcrop[0][x]", 0);
    data.append("imgcrop[0][y]", 0);
    data.append("imgcrop[0][folder]", folder);
    data.append("imgcrop[0][id]", id);

    savePhoto(data);
    addPhoto(result.uri);
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  onPullToRefresh = async () => {
    try {
      this.setState({ refreshing: true });

      if (this.state.myShop) {
        const clientsResponse = await fetchAllShopClients(this.state.myShop.id);
        const { clients, clientsRequests } = clientsResponse;

        this.props.setClients(clients);
        this.props.setClientsRequests(clientsRequests);

        this.setState({ refreshing: false });
      }

      const userInString = await getUserProfile();
      const userInArray = userInString.split("~~"); // convert user profile from string to array
      const [id, firstName, lastName, email, image] = userInArray;
      const user = {
        id,
        firstName,
        lastName,
        email,
        image,
      };

      this.setState({
        user,
        photo: user.image,
      });

    } catch (err) {
      console.warn(err);
      this.setState({ refreshing: false });
    }
  };

  render() {
    const {
      user,
      refreshing,
      photo,
    } = this.state;
    const {
      loading,
      phonePhoto,
    } = this.props;

    if (loading) {
      return <Spinner />;
    };

    return (
      <MyContentWrapper>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onPullToRefresh}
            />
          }
        >
          <View
            style={{
              width: "100%",
              height: scale(100),
              backgroundColor: colors.colorPrimary,
              alignItems: "center",
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
              <TouchableOpacity
                onPress={() => this.showActionSheet()}
              >
                {
                  phonePhoto
                    ? <MyAvatar source={{ uri: `${phonePhoto}`}} />
                    : photo
                      ? <MyAvatar source={{ uri: `${hostImages}${photo + "?" + new Date()}` }} />
                      : <MyAvatar source={ notAvailable } />
                }
              </TouchableOpacity>
              <ActionSheet
                ref={ref => (this.ActionSheet = ref)}
                title={strings("profile.addPhoto")}
                options={[ strings("profile.takePhoto"), strings("profile.picPhoto"), strings("profile.Cancel") ]}
                cancelButtonIndex={2}
                onPress={index => {
                  switch (index) {
                    case 0:
                      return this.takePhoto();
                    case 1:
                      return this.pickPhoto();
                    default:
                  }
                }}
              />
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: scale(20),
              backgroundColor: "rgba(243, 243, 245, 0.5)",
              alignItems: "center",
              marginTop: width <= 320 ? width * 0.29 : width * 0.21,
            }}>
            <Text style={styles.textStyle}>{strings("profile.changePhoto")}</Text>
          </View>
          <MyInfo>
            <MyInfoItem value={user.firstName + " " + user.lastName} />
            <MyInfoItem value={user.email} />
          </MyInfo>

          <View style={{ marginTop: 30 }}>
            <Button
              fontSize="12"
              type="custom"
              outlined={true}
              color={colors.colorPrimary}
              text={strings("profile.buttonExit")}
              onPress={this.renderModalConfirm}
            />
          </View>
        </ScrollView>
      </MyContentWrapper>
    );
  }
}

MyProfileScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: () => (
    <PriceDetailHeader
      title={strings("profile.myProfile")}
      color={colors.textColorPrimary}
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
  // невидимый элемент, чтобы выровнять
  // текст заголовка по центру
  headerRight: () => (
    <View style={{ marginRight: 15 }} />
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
  }
});

const styles = StyleSheet.create({
  arrowBack: {
    fontSize: 30,
    marginLeft: 25,
    color: "white",
    marginTop: Platform.OS === "android" ? 20 : windowHeight > 667 ? 0 : 15,
  },
  iosHeaderCenter: {
    height: "100%",
    alignItems: "center",
    marginBottom: 5,
  },
  settings: {
    width: 30,
    height: 30,
  },
  textStyle: {
    fontSize: 10,
  },
});
export default MyProfileScreen;
