import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';

import { Container, Content } from 'native-base';

import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { BluetoothStatus } from 'react-native-bluetooth-status';

import MyBleManager from '../components/ble.js';
import CommonButton from '../components/commonbutton.js';
import CommonHeader from '../components/commonheader.js';

import { getString } from '../data/strings';
import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';
import { CONFIG } from '../data/config';
import FastImage from 'react-native-fast-image';


const BleSearch = ({ navigation, route }) => {
  const bleConnCheckInterval = 500;

  const bleInstance = MyBleManager.instance;


  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then((granted) => {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        })
          .then(() => {
            initBluetooth();
          })
          .catch((error) => {
            console.info(error);
          });
      });
    } else {
      initBluetooth();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initBluetooth = async () => {
    console.info('bt init');
    const isEnabled = await BluetoothStatus.state();

    if (isEnabled) {
      connectFirst();
    } else if (!isEnabled && Platform.OS === 'android') {
      BluetoothStatus.enable();
      setTimeout(() => {
        connectFirst();
      }, 5000);
    } else {
      setTimeout(() => {
        connectFirst();
      }, 5000);
      Alert.alert(getString('checkBluetooth'));
    }
  };

  const connectFirst = () => {
    //bleInstance.searchDevices();
    bleInstance.connectSelectedDevice("Vagustim_30:83:98:EB:C1:1C", 2);
    waitConnection();
  };

  const waitConnection = () => {
    if (!bleInstance.isConnected) {
      setTimeout(() => {
        waitConnection();
      }, bleConnCheckInterval);
    } else {
      navigation.navigate('BleConnected');
    }
  };

  const getBLEImage = () => {
    return (
      <View style={styles.imageView}>
        <FastImage
          style={styles.gifStyle}
          source={require('../images/bluetooth.gif')}
          resizeMode={FastImage.resizeMode.center}
        />
      </View>
    );
  };

  return (
    <Container>
      <CommonHeader
        text={getString('bleConnection')}
        isBackActive={!CONFIG.userRole.includes("ROLE_RESEARCHER")}
        onPressBack={() => {
          navigation.navigate('UserPage');
        }}
        isSettingsActive={false}
      />
      <Content contentContainerStyle={styles.content}>
        <View style={styles.topTextView}>
          <Text style={styles.searchingText}>{getString('searching')}</Text>
        </View>
        {getBLEImage()}
        <View style={styles.buttonAndText}>
          <CommonButton
            text={getString('back')}
            onPress={() => {
              if (CONFIG.userRole.includes("ROLE_RESEARCHER")) {
                navigation.navigate('Login');
              } else {
                navigation.navigate('UserPage');
              }
            }}
            buttonColor={COLORS.buttonRed}
            buttonWidth={'80%'}
            buttonMarginBottom={16}
          />
          <Text
            style={styles.buyText}
            onPress={() => {
              Linking.openURL('https://vagustim.io/');
            }}>
            {getString('buyDevice')}
          </Text>
        </View>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  imageStyle: {
    width: '100%',
    height: undefined,
  },
  topTextView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonAndText: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchingText: {
    fontFamily: DEFAULT_FONT,
    fontSize: 19,
    color: COLORS.darkerTextColor,
  },
  buyText: {
    fontFamily: DEFAULT_FONT,
    fontSize: 15,
    padding: 8,
    color: COLORS.blueTextColor,
  },
  gifStyle: {
    width: 350,
    height: 350,
  },
});

export default BleSearch;
