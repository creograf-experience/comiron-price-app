import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-navigation';
import {
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  StatusBar,
  Platform,
} from 'react-native';
import { ScreenOrientation } from 'expo';
import { IconButton } from '../../components';

const windowHeight = Dimensions.get('window').height;

class ImageFullScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {

    return {
      title: null,
      headerBackImage:()=> (
        <IconButton
          name={'ios-arrow-back'}
          stylesContainer={Platform === "ios" ? styles.iosHeaderCenter : {}}
          stylesIcon={styles.arrowBack}
          onPress={() => navigation.goBack()}
        />
      ),
      headerBackTitleVisible:null,
      headerTransparent: true,
      headerStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    };
  }


  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <StatusBar hidden />
        <TouchableWithoutFeedback onPress={() =>{}}>
          <Image 
            source={{ uri: navigation.getParam('image') }}
            style={{ flex: 1 }}
            resizeMode="contain"
          />
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }
}

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
    marginBottom: 5,
    marginRight: 15,
  }
});


ImageFullScreen.propTypes = {
  navigation: PropTypes.shape({
    setParams: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};

export default ImageFullScreen;
