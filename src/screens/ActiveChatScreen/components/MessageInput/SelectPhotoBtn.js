import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { colors } from '../../../../constants';

class SelectPhotoBtn extends PureComponent {
  render() {
    return (
      <TouchableOpacity
        onPress={this._onOpenActionSheet}
        style={styles.inputBtn}
      >
        <Image
          source={require('../../../../../assets/photo-camera.png')}
          style={{ width: 25, height: 25, tintColor:colors.dataColor }}
        />
      </TouchableOpacity>
    );
  }

  _onOpenActionSheet = () => {
    Keyboard.dismiss();

    const options = ['Библиотека', 'Камера', 'Отмена'];
    const cancelButtonIndex = 2;
    const destructiveButtonIndex = 2;
    const title = 'Выберите фотографию...';
  
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title,
      },
      buttonIndex => this.handleActionSheet(buttonIndex),
    );
  };

  handleActionSheet = index => {
    switch (index) {
      case 0:
        this.pickImage();
        break;

      case 1:
        this.takePhoto();
        break;
    }
  };

  pickImage = async () => {
    try {
      if (Platform.OS === 'ios') {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          return Alert
            .alert('Нет доступа к хранилищу', 'Предоставьте доступ в настройках');
        }
      }

      const { setAttachment } = this.props;
      const image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        base64: true,
      });

      if (image.cancelled) return;

      setAttachment(image);
    } catch (err) {
      console.error(err);
    }
  };

  takePhoto = async () => {
    try {
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA,
        Permissions.CAMERA_ROLL
      );
      if (status !== 'granted') {
        return Alert
          .alert('Нет доступа к камере', 'Предоставьте доступ в настройках');
      }

      const { setAttachment } = this.props;
      const image = await ImagePicker.launchCameraAsync({
        base64: true,
      });

      if (image.cancelled) return;

      setAttachment(image);
    } catch (err) {
      console.error(err);
    }
  };
}

const styles = StyleSheet.create({
  inputBtn: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

SelectPhotoBtn.propTypes = {
  setAttachment: PropTypes.func.isRequired,
};

export default connectActionSheet(SelectPhotoBtn);