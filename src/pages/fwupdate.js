import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TextInput, Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressCircle from 'react-native-progress-circle';

import { Container, Content } from 'native-base';
import { Buffer } from 'buffer';

import MyBleManager from '../components/ble.js';
import CommonHeader from '../components/commonheader.js';
import CommonButton from '../components/commonbutton.js';

import { wifiEmptyImageData, wifiFullImageData } from '../data/imagedata';
import { getString } from '../data/strings';
import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';
import { CONFIG } from '../data/config';

const FwUpdate = ({ navigation }) => {
  const [wifiName, setWifiName] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiStarted, setWifiStarted] = useState(false);
  const [wifiConnected, setWifiConnected] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);

  const bleInstance = MyBleManager.instance;
  const returnToSearchLength = 5000;

  const wifiNameKey = 'wifi-name';
  const wifiPassKey = 'wifi-pass';

  var dcCheckStarted = false;

  //Get previous wifi creds if available
  useEffect(() => {
    getWifiCreds();
  }, []);

  //Setup OTA notifications
  useEffect(() => {
    setupNotification();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getWifiCreds = async () => {
    let recoveredName = await AsyncStorage.getItem(wifiNameKey);
    let recoveredPass = await AsyncStorage.getItem(wifiPassKey);
    if (recoveredName && recoveredPass) {
      setWifiName(recoveredName);
      setWifiPass(recoveredPass);
    }
  };

  const setupNotification = () => {
    if (bleInstance.connectedDevice !== null) {
      //Monitor ota status
      bleInstance.connectedDevice.monitorCharacteristicForService(
        bleInstance.OTA_SERVICE_UUID,
        bleInstance.OTA_CHAR2_UUID,
        (error, characteristic) => {
          if (!error) {
            let currentVal = Buffer.from(
              characteristic.value,
              'base64',
            ).toString();

            if (currentVal === 'wifi-init') {
              setWifiStarted(true);
            } else if (currentVal === 'wifi-ok') {
              setWifiConnected(true);
              CONFIG.otaInProgress = true;
              if (!dcCheckStarted) {
                dcCheckStarted = true;
                checkOTADc();
              }
            } else if (currentVal === 'ota-ok') {
              setUpdateComplete(true);
            } else if (currentVal === 'ota-fail') {
              setWifiStarted(false);
              setWifiConnected(false);
              setWifiName('');
              setWifiPass('');
              handleUpdateFailed();
            } else {
              setWifiStarted(false);
              setWifiConnected(false);
              setWifiName('');
              setWifiPass('');
              Alert.alert(getString('checkCred'));
            }

            console.info('Update data: ' + currentVal);
          }
        },
        bleInstance.OTA_CHAR2_UUID,
      );
    }
  };

  const checkOTADc = () => {
    setTimeout(() => {
      if (!bleInstance.isConnected) {
        console.info('Update completed');
        setUpdateComplete(true);
        setTimeout(() => {
          navigation.navigation('BleSearch');
        }, returnToSearchLength);
      } else {
        checkOTADc();
      }
    }, 1000);
  };

  const handleUpdateFailed = () => {
    bleInstance.isConnected = false;
    Alert.alert(getString('updateFailed'));
    navigation.reset({
      index: 0,
      routes: [{ name: 'BleSearch' }],
    });
  };

  const handleConnect = () => {
    if (wifiName !== '' && wifiPass !== '') {
      AsyncStorage.setItem(wifiNameKey, wifiName);
      AsyncStorage.setItem(wifiPassKey, wifiPass);

      bleInstance
        .writeStringData(
          wifiName,
          bleInstance.OTA_SERVICE_UUID,
          bleInstance.OTA_CHAR0_UUID,
        )
        .then((responseName) => {
          bleInstance
            .writeStringData(
              wifiPass,
              bleInstance.OTA_SERVICE_UUID,
              bleInstance.OTA_CHAR1_UUID,
            )
            .then((responsePass) => {
              console.info('Wifi should init now.');
              bleInstance
                .writeStringData(
                  CONFIG.otaServer + CONFIG.embeddedMAC,
                  bleInstance.OTA_SERVICE_UUID,
                  bleInstance.OTA_CHAR3_UUID,
                )
                .then((responseAddr) => {
                  console.info('Written OTA address.');
                })
                .catch((error) => {
                  console.info('OTA address write error: ' + error);
                });
            })
            .catch((error) => {
              handleConnect();
              console.info('Wifi pass write error: ' + error);
            });
        })
        .catch((error) => {
          handleConnect();
          console.info('Wifi name write error: ' + error);
        });
    }
  };

  const getImage = () => {
    if (!wifiStarted) {
      return (
        <Image
          style={[
            styles.imageStyle,
            {
              aspectRatio: wifiEmptyImageData.width / wifiEmptyImageData.height,
            },
          ]}
          source={wifiEmptyImageData.src}
        />
      );
    } else if (!wifiConnected) {
      return (
        <Image
          style={[
            styles.imageStyle,
            {
              aspectRatio: wifiEmptyImageData.width / wifiEmptyImageData.height,
            },
          ]}
          source={wifiEmptyImageData.src}
        />
      );
    } else {
      return (
        <Image
          style={[
            styles.imageStyle,
            {
              aspectRatio: wifiFullImageData.width / wifiFullImageData.height,
            },
          ]}
          source={wifiFullImageData.src}
        />
      );
    }
  };

  const getBottomView = () => {
    if (!wifiStarted) {
      return (
        <>
          <View style={styles.inputView}>
            <View style={styles.credView}>
              <TextInput
                style={styles.textInputStyle}
                underlineColorAndroid={'transparent'}
                autoCorrect={false}
                onChangeText={(text) => {
                  setWifiName(text);
                }}
                placeholder={getString('wifiName')}
                placeholderTextColor={COLORS.lightTextColor}
                value={wifiName}
              />
            </View>
            <View style={styles.credView}>
              <TextInput
                style={styles.textInputStyle}
                underlineColorAndroid={'transparent'}
                autoCorrect={false}
                secureTextEntry={true}
                onChangeText={(text) => {
                  setWifiPass(text);
                }}
                placeholder={getString('password')}
                placeholderTextColor={COLORS.lightTextColor}
                value={wifiPass}
              />
            </View>
          </View>
          <View style={styles.buttonView}>
            <CommonButton
              text={getString('connectAndUpdate')}
              onPress={() => {
                handleConnect();
              }}
              buttonColor={COLORS.buttonGreen}
              buttonWidth={'80%'}
              buttonMarginTop={36}
            />
            <Text
              style={styles.skipText}
              onPress={() => {
                CONFIG.skipUpdate = true;
                navigation.navigate('BleControl');
              }}>
              {getString('skip')}
            </Text>
          </View>
        </>
      );
    } else if (!wifiConnected) {
      return (
        <View style={styles.updateView}>
          <Text style={styles.updateInfoText}>{getString('recCred')}</Text>
          <ProgressCircle
            percent={100}
            radius={100}
            borderWidth={6}
            color={COLORS.greyButtonColor}
            shadowColor="#999"
            bgColor="#fff">
            <Text style={styles.updateStatusText}>
              {getString('waitingText')}
            </Text>
          </ProgressCircle>
        </View>
      );
    } else if (!updateComplete) {
      return (
        <View style={styles.updateView}>
          <Text style={styles.updateInfoText}>{getString('updateInProg')}</Text>
          <ProgressCircle
            percent={100}
            radius={100}
            borderWidth={6}
            color={COLORS.buttonBlue}
            shadowColor="#999"
            bgColor="#fff">
            <Text style={styles.updateStatusText}>
              {getString('updatingText')}
            </Text>
          </ProgressCircle>
        </View>
      );
    } else {
      return (
        <View style={styles.updateView}>
          <Text style={styles.updateInfoText}>
            {getString('updateComplete')}
          </Text>
          <ProgressCircle
            percent={100}
            radius={100}
            borderWidth={6}
            color={COLORS.buttonGreen}
            shadowColor="#999"
            bgColor="#fff">
            <Text style={styles.updateStatusText}>
              {getString('updatedText')}
            </Text>
          </ProgressCircle>
        </View>
      );
    }
  };

  return (
    <Container>
      <CommonHeader
        text={getString('fwUpdate')}
        isBackActive={true}
        onPressBack={() => {
          navigation.navigate('BleControl');
        }}
        isSettingsActive={false}
      />
      <Content contentContainerStyle={styles.content}>
        <View style={styles.iconAndText}>
          {getImage()}
          <Text style={styles.fwUpdateText}>{getString('fwUpdate')}</Text>
          <Text style={styles.fwUpdateInfoText}>
            {wifiStarted ? getString('plsDoNot') : getString('fwAvail')}
          </Text>
        </View>
        <View style={styles.inputAndButtons}>{getBottomView()}</View>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  iconAndText: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.lightGrey,
    marginVertical: 32,
  },
  inputAndButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  inputView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonView: {
    alignItems: 'center',
    width: '100%',
  },
  updateView: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  credView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 48,
    marginVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.wifiInputBorderColor,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 16,
    fontFamily: DEFAULT_FONT,
    height: 48,
    color: COLORS.darkerTextColor,
    marginLeft: 16,
  },
  imageStyle: {
    width: '27%',
    height: undefined,
  },
  fwUpdateText: {
    width: '80%',
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
    fontSize: 25,
    color: COLORS.blueTextColor,
    marginTop: 16,
  },
  fwUpdateInfoText: {
    width: '80%',
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
    fontSize: 15,
    color: COLORS.darkerTextColor,
    marginTop: 16,
    marginBottom: 32,
  },
  skipText: {
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
    fontSize: 15,
    color: COLORS.darkerTextColor,
    marginTop: 12,
    padding: 8,
  },
  updateInfoText: {
    width: '80%',
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
    fontSize: 16,
    color: COLORS.darkerTextColor,
    marginBottom: 64,
  },
  updateStatusText: {
    width: '80%',
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
    fontSize: 18,
    color: COLORS.darkerTextColor,
  },
});

export default FwUpdate;
