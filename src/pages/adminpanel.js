import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';

import { Container, View } from 'native-base';

import MyBleManager from '../components/ble.js';
import CommonHeader from '../components/commonheader.js';
import CommonButton from '../components/commonbutton.js';
import ParamButton from '../components/parambutton';

import { Buffer } from 'buffer';

import { getString } from '../data/strings';
import { COLORS } from '../style/colors';
import { CONFIG } from '../data/config';


const AdminPanel = ({ navigation }) => {
  const [devVoltage, setDevVoltage] = useState(25);
  const [devFreq, setDevFreq] = useState(50);
  const [devPulse, setDevPulse] = useState(250);
  const [devOnDur, setDevOnDur] = useState(30);
  const [devTotalDur, setDevTotalDur] = useState(5);


  const bleInstance = MyBleManager.instance;

  const maxVoltage = 50;
  const minVoltage = 10;
  const maxFreq = 500;
  const minFreq = 1;
  const maxPulseWidth = 1000;
  const minPulseWidth = 50;
  const onOffMax = 60;
  const onOffMin = 0;
  const maxTimeInMins = 360;
  const minTimeInMins = 1;

  const voltageStep = 1;
  const pulseWidthStep = 25;
  const frequencyStep = 5;
  const onOffStep = 5;
  const totalDurationStep = 5;

  useEffect(() => {
    readConfigurations();
  }, []);

  const readConfigurations = () => {
    if (bleInstance.connectedDevice !== null) {
      bleInstance.connectedDevice
        .readCharacteristicForService(
          bleInstance.CONTROL_SERVICE_UUID,
          bleInstance.CONTROL_CHAR0_UUID,
          bleInstance.CONTROL_CHAR0_UUID,
        )
        .then((characteristic) => {
          let stateVal = Buffer.from(characteristic.value, 'base64').toString();
          console.info('Admin panel - Read config: ' + stateVal);

          //Retrieve pulse width
          let charIndex = stateVal.indexOf(bleInstance.pulseWidthChar);
          let charStr = stateVal.substr(
            charIndex + 1,
            stateVal.indexOf(';', charIndex) - charIndex - 1,
          );
          setDevPulse(parseInt(charStr, 10));

          //Retrieve freq
          charIndex = stateVal.indexOf(bleInstance.frequencyChar);
          charStr = stateVal.substr(
            charIndex + 1,
            stateVal.indexOf(';', charIndex) - charIndex - 1,
          );
          setDevFreq(parseInt(charStr, 10));

          //Retrieve dur on
          charIndex = stateVal.indexOf(bleInstance.durOnChar);
          charStr = stateVal.substr(
            charIndex + 1,
            stateVal.indexOf(';', charIndex) - charIndex - 1,
          );
          setDevOnDur(parseInt(charStr, 10));

          //Retrieve total dur
          charIndex = stateVal.indexOf(bleInstance.totalDurationChar);
          charStr = stateVal.substr(
            charIndex + 1,
            stateVal.indexOf(';', charIndex) - charIndex - 1,
          );
          setDevTotalDur(Math.floor(parseInt(charStr, 10) / 60));

          //Retrieve voltage
          charIndex = stateVal.indexOf(bleInstance.voltageChar);
          charStr = stateVal.substr(
            charIndex + 1,
            stateVal.indexOf(';', charIndex) - charIndex - 1,
          );
          setDevVoltage(parseInt(charStr, 10));
          Alert.alert(getString('readConf'));
        })
        .catch((error) => {
          console.info('Admin Panel - Read conf error: ' + error);

          setTimeout(() => {
            readConfigurations();
          }, 1000);
        });
    }
  };

  const updateConfig = (onlyIntensity) => {
    let confString = '';

    let validDevVoltage = Math.max(minVoltage, Math.min(maxVoltage, devVoltage));
    let validDevPulse = Math.max(minPulseWidth, Math.min(maxPulseWidth, devPulse));
    let validDevOnDur = Math.max(onOffMin, Math.min(onOffMax, devOnDur));
    let validDevFreq = Math.max(minFreq, Math.min(maxFreq, devFreq));
    let validDevTotalDur = Math.max(minTimeInMins, Math.min(maxTimeInMins, devTotalDur));

    setDevVoltage(validDevVoltage);
    setDevPulse(validDevPulse);
    setDevOnDur(validDevOnDur);
    setDevFreq(validDevFreq);
    setDevTotalDur(validDevTotalDur);

    confString += bleInstance.pulseWidthChar + String(validDevPulse) + ';';
    confString += bleInstance.frequencyChar + String(validDevFreq) + ';';
    confString += bleInstance.durOnChar + String(validDevOnDur) + ';';
    confString += bleInstance.durOffChar + String((60 - validDevOnDur)) + ';';
    confString += bleInstance.totalDurationChar + String((validDevTotalDur * 60)) + ';';
    confString += bleInstance.voltageChar + String(validDevVoltage) + ';';

    confString += '+' + confString.length;

    //Send config
    bleInstance
      .writeStringData(
        confString,
        bleInstance.CONTROL_SERVICE_UUID,
        bleInstance.CONTROL_CHAR0_UUID,
      )
      .then((response) => {
        CONFIG.adminUpdatedSettings = true;

        console.info('Sent config successfully: ' + confString);
        Alert.alert(getString('confSent'));
      })
      .catch((error) => {
        console.info('Send config error: ' + error);
        Alert.alert(getString('sendConfError'));
      });
  };

  const changeTextDevVoltage = (text) => {
    if (text === '') {
      setDevVoltage(0);
    } else {
      let num = parseInt(text.replace(/[^0-9]/g, ''), 10);
      setDevVoltage(num);
    }
  }

  const changeTextDevPulse = (text) => {
    if (text === '') {
      setDevPulse(0);
    } else {
      let num = parseInt(text.replace(/[^0-9]/g, ''), 10);
      setDevPulse(num);
    }
  }

  const changeTextDevFreq = (text) => {
    if (text === '') {
      setDevFreq(0);
    } else {
      let num = parseInt(text.replace(/[^0-9]/g, ''), 10);
      setDevFreq(num);
    }
  }

  const changeTextDevOnDur = (text) => {
    if (text === '') {
      setDevOnDur(0);
    } else {
      let num = parseInt(text.replace(/[^0-9]/g, ''), 10);
      setDevOnDur(num);

    }
  }

  const changeTextDevTotalDur = (text) => {
    if (text === '') {
      setDevTotalDur(0);
    } else {
      let num = parseInt(text.replace(/[^0-9]/g, ''), 10);
      setDevTotalDur(num);
    }
  }

  return (
    <Container>
      <CommonHeader
        text={getString('adminPanel')}
        isBackActive={true}
        onPressBack={() => {
          navigation.navigate('BleControl');
        }}
        isSettingsActive={false}
      />
      <View style={styles.wrapperView}>
        <View style={styles.optionsView}>
          <View style={styles.optionTextView}>
            <View style={styles.optionTextWrapperView}>
              <Text style={styles.optionTextStyle}>
                {getString('voltage')}
              </Text>
              <Text style={styles.optionRangeText}>
                {minVoltage} - {maxVoltage} {getString('v')}
              </Text>
            </View>
            <View style={styles.optionTextWrapperView}>
              <Text style={styles.optionTextStyle}>
                {getString('pulseWidth')}
              </Text>
              <Text style={styles.optionRangeText}>
                {minPulseWidth} - {maxPulseWidth} {getString('us')}
              </Text>
            </View>
            <View style={styles.optionTextWrapperView}>
              <Text style={styles.optionTextStyle}>
                {getString('frequency')}
              </Text>
              <Text style={styles.optionRangeText}>
                {minFreq} - {maxFreq} {getString('hz')}
              </Text>
            </View>
            <View style={styles.optionTextWrapperView}>
              <Text style={styles.optionTextStyle}>
                {getString('onDur')}
              </Text>
              <Text style={styles.optionRangeText}>
                {onOffMin} - {onOffMax} {getString('sec')}
              </Text>
            </View>
            <View style={styles.optionTextWrapperView}>
              <Text style={styles.optionTextStyle}>
                {getString('stimDur')}
              </Text>
              <Text style={styles.optionRangeText}>
                {minTimeInMins} - {maxTimeInMins} {getString('minsLong')}
              </Text>
            </View>
          </View>
          <View style={styles.optionFieldView}>
            <ParamButton
              paramValue={String(devVoltage)}
              unitText={getString('v')}
              onPressMinus={() => { setDevVoltage(Math.max(minVoltage, devVoltage - voltageStep)); }}
              onPressPlus={() => { setDevVoltage(Math.min(maxVoltage, devVoltage + voltageStep)); }}
              onChangeParamText={(text) => { changeTextDevVoltage(text) }}
            />
            <ParamButton
              paramValue={String(devPulse)}
              unitText={getString('us')}
              onPressMinus={() => { setDevPulse(Math.max(minPulseWidth, devPulse - pulseWidthStep)); }}
              onPressPlus={() => { setDevPulse(Math.min(maxPulseWidth, devPulse + pulseWidthStep)); }}
              onChangeParamText={(text) => { changeTextDevPulse(text) }}
            />
            <ParamButton
              paramValue={String(devFreq)}
              unitText={getString('hz')}
              onPressMinus={() => { setDevFreq(Math.max(minFreq, devFreq - frequencyStep)); }}
              onPressPlus={() => { setDevFreq(Math.min(maxFreq, devFreq + frequencyStep)); }}
              onChangeParamText={(text) => { changeTextDevFreq(text) }}
            />
            <ParamButton
              paramValue={String(devOnDur)}
              unitText={getString('sec')}
              onPressMinus={() => { setDevOnDur(Math.max(onOffMin, devOnDur - onOffStep)); }}
              onPressPlus={() => { setDevOnDur(Math.min(onOffMax, devOnDur + onOffStep)); }}
              onChangeParamText={(text) => { changeTextDevOnDur(text) }}
            />
            <ParamButton
              paramValue={String(devTotalDur)}
              unitText={getString('minsLong')}
              onPressMinus={() => { setDevTotalDur(Math.max(minTimeInMins, devTotalDur - totalDurationStep)); }}
              onPressPlus={() => { setDevTotalDur(Math.min(maxTimeInMins, devTotalDur + totalDurationStep)); }}
              onChangeParamText={(text) => { changeTextDevTotalDur(text) }}
            />
          </View>
        </View>
        <CommonButton
          text={getString('sendConfig')}
          onPress={() => { updateConfig() }}
          buttonColor={COLORS.buttonBlue}
          buttonWidth={'80%'}
          buttonMarginTop={24}
        />
        <Text style={styles.titleText}>
          {getString('firmwareVersion')}: {CONFIG.embeddedVersion}
        </Text>
        <Text style={styles.titleText}>
          {getString('macAddress')}: {CONFIG.embeddedMAC}
        </Text>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  optionsView: {
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '94%',
    height: '50%',
    marginTop: 24,
  },
  optionTextWrapperView: {
    height: 50,
  },
  titleText: {
    width: '80%',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 12,
    color: COLORS.darkerTextColor,
    marginTop: 16,
  },
  optionTextView: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  optionFieldView: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  optionTextStyle: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  optionRangeText: {
    fontSize: 11,
    color: COLORS.darkGray,
  },
  wrapperView: {
    flex: 1,
    alignItems: 'center',
  }
});

export default AdminPanel;
