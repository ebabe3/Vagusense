import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  AppState,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import {Container, Content, Icon} from 'native-base';

import {Buffer} from 'buffer';

import MyBleManager from '../../../components/ble.js';
import CommonHeader from '../../../components/commonheader.js';

import {getString} from '../../../data/strings';
import {COLORS} from '../../../style/colors';
import {CONFIG} from '../../../data/config';

import AwesomeAlert from 'react-native-awesome-alerts';
import {useLiveChart} from '../../../components/useLiveChart.js';

const LiveMeasurement = ({navigation, route}) => {
  const [stimStarted, setStimStarted] = useState(false);
  const [leftProgress, setLeftProgress] = useState(0);
  const [rightProgress, setRightProgress] = useState(0);

  const [appState, setAppState] = useState(AppState.currentState);
  const [textUpdateTime, setTextUpdateTime] = useState(0);

  const [ppgValue, setPpgValue] = useState([0]);
  const [skinResponseValue, setSkinResponseValue] = useState([0]);
  const [currentPpg, setCurrentPpg] = useState(0);
  const [currentSkinResponse, setCurrentSkinResponse] = useState(0);

  const [hrDataSource, setHrDataSource] = useState([0]);
  const [rmssdDataSource, setRmssdDataSource] = useState([0]);
  const [lfhfDataSource, setLfhfDataSource] = useState([0]);
  const [lfDataSource, setLfDataSource] = useState([0]);
  const [hfDataSource, setHfDataSource] = useState([0]);
  const [skinResponseDataSource, setSkinResponseDataSource] = useState([0]);

  const [isDataSaved, setIsDataSaved] = useState(false);

  const bleInstance = MyBleManager.instance;

  const countdownTimeout = 1000;
  const textUpdateTimeout = 10000;

  //Alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAllertMessage] = useState('');

  const RmssdChart = useMemo(() => {
    return useLiveChart(rmssdDataSource);
  }, [rmssdDataSource]);

  const LfhfChart = useMemo(() => {
    return useLiveChart(lfhfDataSource);
  }, [lfhfDataSource]);

  const SkinResponseChart = useMemo(() => {
    return useLiveChart(skinResponseDataSource);
  }, [skinResponseDataSource]);

  const HrChart = useMemo(() => {
    return useLiveChart(hrDataSource);
  }, [hrDataSource]);

  const LfChart = useMemo(() => {
    return useLiveChart(lfDataSource);
  }, [lfDataSource]);

  const HfChart = useMemo(() => {
    return useLiveChart(hfDataSource);
  }, [hfDataSource]);

  openAlert = alertMessage => {
    setShowAlert(true);
    setAllertMessage(alertMessage);
  };

  hideAlert = () => {
    setShowAlert(false);
  };

  //Handle disconnect and timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (!bleInstance.isConnected && !CONFIG.otaInProgress) {
        showDCGoBack();
      }
    }, countdownTimeout);
    return () => {
      clearInterval(timer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //Handle text switches
  useEffect(() => {
    const textTimer = setTimeout(() => {
      setTextUpdateTime(textUpdateTime + 1);
    }, textUpdateTimeout);
    return () => {
      clearTimeout(textTimer);
    };
  }, [textUpdateTime]);

  //Start BLE data transmission
  useEffect(() => {
    startBLEData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //Update Intensity values
  useEffect(() => {
    if (stimStarted && bleInstance.isConnected) {
      bleInstance
        .writeStringData(
          confString,
          bleInstance.CONTROL_SERVICE_UUID,
          bleInstance.CONTROL_CHAR0_UUID,
        )
        .then(response => {
          console.info('Updated intensity to: ' + confString);
        })
        .catch(error => {
          console.info('Updated intensity error: ' + error);
        });
    }
  }, [leftProgress, rightProgress]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAppStateChange = nextAppState => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      if (bleInstance.selectedDevice === null) {
        showDCGoBack();
      } else {
        startBLEData();
      }
    }
    setAppState(nextAppState);
  };

  const showDCGoBack = () => {
    openAlert(getString('bleDc'));
    navigation.reset({
      index: 0,
      routes: [{name: 'BleSearch'}],
    });
  };

  const startBLEData = () => {
    bleInstance.cancelAllTransactions();

    //Setup notifications after a delay
    setTimeout(() => {
      setupNotifications();
    }, 1000);
  };

  const sentData = (ppg, skinResponse) => {
    console.info('data sent');
    fetch(CONFIG.baseServer + 'api/ppgs/live-test', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + CONFIG.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stimulationId: CONFIG.stimulationId,
        ppg: ppg,
        skinResponse: skinResponse,
        isBefore: CONFIG.isBefore,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.info(JSON.stringify(responseData, null, 2));
        setHrDataSource(hrDataSource => [
          ...hrDataSource,
          parseFloat(responseData['hr']),
        ]);
        setRmssdDataSource(rmssdDataSource => [
          ...rmssdDataSource,
          parseFloat(responseData['rmssd']),
        ]);
        setLfhfDataSource(lfhfDataSource => [
          ...lfhfDataSource,
          parseFloat(responseData['lf/hf']),
        ]);
        setLfDataSource(lfDataSource => [
          ...lfDataSource,
          parseFloat(responseData['lf']),
        ]);
        setHfDataSource(hfDataSource => [
          ...hfDataSource,
          parseFloat(responseData['hf']),
        ]);
        setSkinResponseDataSource(skinResponseDataSource => [
          ...skinResponseDataSource,
          parseFloat(responseData['skinResponse']),
        ]);
        //openAlert("HR : " + responseData["HR"] + ", rMSSD : " + responseData["rMSSD"] + ", lf/hf ratio : " + responseData["lf/hf"] + ", avg. SkinResponse : " + responseData["skinResponse"]);
      })
      .catch(error => {
        openAlert(getString('checkNetwork'));
      });
  };

  let i = 0;
  const setupNotifications = () => {
    if (bleInstance.connectedDevice !== null) {
      //Monitor current and voltage data
      bleInstance.connectedDevice.monitorCharacteristicForService(
        bleInstance.STATUS_SERVICE_UUID,
        bleInstance.STATUS_CHAR2_UUID,
        (error, characteristic) => {
          if (!error) {
            let currentVal = Buffer.from(
              characteristic.value,
              'base64',
            ).toString();
            if (
              bleInstance.connectedDevice.localName ===
              route.params.selectedDeviceName
            ) {
              if (ppgValue.length < 3000) {
                let delimIndex = currentVal.indexOf('_');

                let ppgCurrent = parseInt(currentVal.substr(0, delimIndex));
                ppgValue.push(ppgCurrent);
                setCurrentPpg(ppgCurrent);

                currentVal = currentVal.substr(delimIndex + 1);
                delimIndex = currentVal.indexOf('_');

                let skinResponseCurrent = parseInt(
                  currentVal.substr(1, delimIndex),
                );
                skinResponseValue.push(skinResponseCurrent);
                setCurrentSkinResponse(skinResponseCurrent);

                currentVal = currentVal.substr(delimIndex + 1);
                delimIndex = currentVal.indexOf('_');

                /*console.info(
                                    'PPG Current: ' + ppgCurrent,
                                    ' \t SkinResponse Current : ' + skinResponseCurrent,
                                    ' \t current Val : ' + ppgValue.length,
                                );*/
                if (ppgValue.length > 749) {
                  if (ppgValue.length == 750 + i) {
                    i += 125;
                    sentData(
                      ppgValue.slice(i, 750 + i),
                      skinResponseValue.slice(i, 750 + i),
                    );
                  }
                }
              } else {
                if (ppgValue.length === 3000) {
                  ppgValue.push(0);
                  console.info(
                    'stimulationId: ' + CONFIG.stimulationId
                  );
                  setIsDataSaved(true);
                  fetch(CONFIG.baseServer + 'api/ppgs/', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      Authorization: 'Bearer ' + CONFIG.token,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      stimulationId: CONFIG.stimulationId,
                      ppg: ppgValue,
                      skinResponse: skinResponseValue,
                      isBefore: CONFIG.isBefore,
                    }),
                  })
                    .then(response => response.json())
                    .then(responseData => {
                      console.info(JSON.stringify(responseData, null, 2));
                      if (responseData.message === 'PPG created') {
                        console.info('PPG Added Successfully');
                        openAlert('Nabız verisi alındı');
                      } else {
                        openAlert(getString('unknownErrorOccured'));
                      }
                    })
                    .catch(error => {
                      setRequestActive(false);
                      openAlert(getString('checkNetwork'));
                    });
                }
              }
            }
          }
        },
        bleInstance.STATUS_CHAR2_UUID,
      );
    }
  };

  return (
    <Container>
      <CommonHeader
        text={getString('deviceControl')}
        isBackActive={!CONFIG.userRole.includes('ROLE_RESEARCHER')}
        onPressBack={() => {
          navigation.navigate('BleConnected');
        }}
        onPressSettings={() => {
          navigation.navigate('AdminPanel');
        }}
        isSettingsActive={CONFIG.userRole !== 'ROLE_USER'}
      />
      <Content contentContainerStyle={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollViewStyle}>
          <Text>HR</Text>
          {HrChart}
          <Text>rMSSD</Text>
          {RmssdChart}
          <Text>LF/HF Ratio</Text>
          {LfhfChart}
          <Text>LF</Text>
          {HfChart}
          <Text>HF</Text>
          {LfChart}
          <Text>Skin Response</Text>
          {SkinResponseChart}
        </ScrollView>
        {/* Alert Component */}
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          message={alertMessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText="Tamamla"
          confirmButtonColor={COLORS.vagustimBlue}
          onCancelPressed={() => {
            //hideAlert();
          }}
          onConfirmPressed={() => {
            navigation.navigate('Login');
          }}
          onDismiss={() => {
            //hideAlert();
          }}
        />
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollViewStyle: {
    marginTop: '3%',
    height: '100%',
    width: '90%',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconView: {
    flex: 3,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 24,
  },
  textView: {
    flex: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: COLORS.lightGrey,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  controlView: {
    flex: 5,
    marginTop: '10%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.controlBackgroundColor,
    borderColor: COLORS.lightGrey,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headphoneSelectView: {
    flex: 3,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: COLORS.controlBackgroundColor,
  },
  intensityView: {
    flex: 18,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  batIconStyle: {
    marginLeft: 8,
    color: COLORS.darkerTextColor,
    fontSize: 22,
  },
  bluetoothIconStyle: {
    color: COLORS.blueTextColor,
    fontSize: 24,
  },
});

export default LiveMeasurement;
