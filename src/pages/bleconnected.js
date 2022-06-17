import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Container, Content } from 'native-base';

import MyBleManager from '../components/ble.js';
import CommonButton from '../components/commonbutton.js';
import CommonHeader from '../components/commonheader.js';

import { CONFIG } from '../data/config';
import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';
import { getString } from '../data/strings';

const BleConnected = ({ navigation, route }) => {
  const [isStimStarted, setStimStarted] = useState(CONFIG.stimInProgress);

  const bleInstance = MyBleManager.instance;

  useEffect(() => {
    setStimStarted(CONFIG.stimInProgress);
    navigation.addListener('focus', () => {
      setStimStarted(CONFIG.stimInProgress);
    });
  }, [])

  const startHandler = () => {
    if (bleInstance.isConnected) {
      navigation.navigate('BleControl', {
        selectedDeviceName: route.params.selectedDeviceName
      });
    } else {
      navigation.navigate('BleSearch');
    }
  };

  return (
    <Container>
      <CommonHeader
        text={getString('bleConnection')}
        isBackActive={!CONFIG.userRole.includes("ROLE_RESEARCHER")}
        onPressBack={() => {
          navigation.navigate('UserPage');
        }}
        onPressSettings={() => {
          navigation.navigate('Settings', {
            isEdit: false,
          });
        }}
        isSettingsActive={CONFIG.userRole.includes("ROLE_RESEARCHER")}
      />
      <Content contentContainerStyle={styles.content}>
        <View style={styles.textView}>
          <Text style={styles.congratsText}>{getString('congrats')}</Text>
          {CONFIG.stimInProgress ? (
            <Text style={styles.readyText}>{getString('continueToStim')}</Text>
          ) : (
            <>
              <Text style={styles.readyText}>{"Ölçümü başlatmaya hazırsınız"}</Text>
            </>
          )}
        </View>
        <View style={styles.buttonView}>
          <CommonButton
            text={isStimStarted ? getString('continue') : getString('start')}
            onPress={startHandler}
            buttonColor={COLORS.buttonBlue}
            buttonWidth={'90%'}
            buttonMarginBottom={56}
          />
        </View>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '85%',
  },
  textView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonView: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  congratsText: {
    fontSize: 19,
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
    color: COLORS.darkerTextColor,
    marginBottom: 8,
  },
  readyText: {
    fontSize: 19,
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
    color: COLORS.lightTextColor,
  },
});

export default BleConnected;
