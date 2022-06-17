import React, { useState, useEffect } from 'react';
import { View, StyleSheet, AppState, TouchableOpacity, Text, Alert } from 'react-native';

import GestureRecognizer from 'react-native-swipe-gestures';

import { Container, Content, Icon } from 'native-base';

import { Buffer } from 'buffer';

import MyBleManager from '../components/ble.js';
import CommonHeader from '../components/commonheader.js';
import HeadphoneSelect from '../components/headphoneselect.js';
import ControlPanel from '../components/controlpanel.js';
import HeadphoneControl from '../components/headphonecontrol.js';

import { getString } from '../data/strings';
import { COLORS } from '../style/colors';
import { CONFIG } from '../data/config';

import Analytics from 'appcenter-analytics';


import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

const BleControl = ({ navigation, route }) => {
  const [gotSuggest, setGotSuggest] = useState(false);

  const [suggestFreq, setSuggestFreq] = useState(0);
  const [suggestPulse, setSuggestPulse] = useState(0);
  const [suggestOnDur, setSuggestOnDur] = useState(0);
  const [suggestOffDur, setSuggestOffDur] = useState(0);
  const [suggestTotalDur, setSuggestTotalDur] = useState(300);

  const [remDuration, setRemDuration] = useState(300);

  const [devVoltage, setDevVoltage] = useState(0);
  const [devFreq, setDevFreq] = useState(0);
  const [devPulse, setDevPulse] = useState(0);
  const [devOnDur, setDevOnDur] = useState(0);
  const [devTotalDur, setDevTotalDur] = useState(0);

  const [batteryLevel, setBatteryLevel] = useState(0);
  const [headLConnected, setHeadLConnected] = useState(true);
  const [headRConnected, setHeadRConnected] = useState(true);
  const [leftCurrentMA, setLeftCurrentMA] = useState(0);
  const [rightCurrentMA, setRightCurrentMA] = useState(0);

  const [stimStarted, setStimStarted] = useState(false);
  const [stimPaused, setStimPaused] = useState(false);
  const [stimOffTime, setStimOffTime] = useState(false);

  const [headphoneLSelected, setHeadphoneLSelected] = useState(true);
  const [leftProgress, setLeftProgress] = useState(0);
  const [rightProgress, setRightProgress] = useState(0);

  const [appState, setAppState] = useState(AppState.currentState);
  const [bleTextIndex, setBleTextIndex] = useState(0);
  const [textUpdateTime, setTextUpdateTime] = useState(0);

  const [ppgValue, setPpgValue] = useState([0]);
  const [skinResponseValue, setSkinResponseValue] = useState([0]);
  const [currentPpg, setCurrentPpg] = useState(0);
  const [currentSkinResponse, setCurrentSkinResponse] = useState(0);

  const bleInstance = MyBleManager.instance;

  const countdownTimeout = 1000;
  const textUpdateTimeout = 10000;
  const stimFinishedTimeout = 500;

  const readFieldDelay = 1000;
  const headphoneCurrentThreshold = 1;
  const intensityProgressMaxValue = 100;

  var isFinishMessageSent = false;

  var leftProgressEmbedded = 0;
  var rightProgressEmbedded = 0;

  const config = {
    velocityThreshold: 0.05,
    directionalOffsetThreshold: 1000,
    gestureIsClickThreshold: 3,
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
      setBleTextIndex((prevIndex) => (prevIndex + 1) % 3);
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
    let confString = getConfigString(true);
    if (stimStarted && bleInstance.isConnected) {
      bleInstance
        .writeStringData(
          confString,
          bleInstance.CONTROL_SERVICE_UUID,
          bleInstance.CONTROL_CHAR0_UUID,
        )
        .then((response) => {
          console.info('Updated intensity to: ' + confString);
        })
        .catch((error) => {
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

  const getParamSuggest = () => {
    console.info('sugg');
    fetch(CONFIG.baseServer + 'api/2.0/suggests/getMySuggest/' + CONFIG.patientId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + CONFIG.token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.info('suggest ' + JSON.stringify(responseData));
        if (responseData['parameter']) {
          console.info('Got suggests');
          setGotSuggest(true);
          setSuggestFreq(responseData['parameter']['frequency']);
          setSuggestPulse(responseData['parameter']['pulseWidth']);
          setSuggestTotalDur(responseData['parameter']['totalDuration'] * 60);
          setSuggestOnDur(responseData['parameter']['onDuration']);
          setSuggestOffDur(responseData['parameter']['offDuration']);
          CONFIG.suggestId = responseData.suggestId;
        } else {
          console.info('No suggest found');
        }
      })
      .catch((error) => {
        console.info(error);
      });
  };

  const handleAppStateChange = (nextAppState) => {
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
    Alert.alert(getString('bleDc'));
    navigation.reset({
      index: 0,
      routes: [{ name: 'BleSearch' }],
    });
  };

  const startBLEData = () => {
    bleInstance.cancelAllTransactions();
    readConfigurations();

    //Setup notifications after a delay
    setTimeout(() => {
      setupNotifications();
    }, 1000);
  };

  const setupNotifications = () => {
    if (bleInstance.connectedDevice !== null) {
      //Monitor battery level
      bleInstance.connectedDevice.monitorCharacteristicForService(
        bleInstance.STATUS_SERVICE_UUID,
        bleInstance.STATUS_CHAR1_UUID,
        (error, characteristic) => {
          if (!error) {
            let currentVal = Buffer.from(
              characteristic.value,
              'base64',
            ).toString();

            console.info('Battery level: ' + currentVal);
            setBatteryLevel(currentVal);
          }
        },
        bleInstance.STATUS_CHAR1_UUID,
      );

      //Monitor finish status
      bleInstance.connectedDevice.monitorCharacteristicForService(
        bleInstance.CONTROL_SERVICE_UUID,
        bleInstance.CONTROL_CHAR1_UUID,
        (error, characteristic) => {
          if (!error) {
            let currentVal = Buffer.from(
              characteristic.value,
              'base64',
            ).toString();

            if (currentVal === 'fin') {
              stimFinished();
            }
          }
        },
        bleInstance.CONTROL_CHAR1_UUID,
      );

      console.log(route.params.selectedDeviceName);

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

            if (bleInstance.connectedDevice.localName === route.params.selectedDeviceName) {
              if (ppgValue.length < 750) {
                let delimIndex = currentVal.indexOf('_');

                let ppgCurrent = parseInt(currentVal.substr(0, delimIndex));
                ppgValue.push(ppgCurrent);
                setCurrentPpg(ppgCurrent);

                currentVal = currentVal.substr(delimIndex + 1);
                delimIndex = currentVal.indexOf('_');

                let skinResponseCurrent = parseInt(currentVal.substr(1, delimIndex));
                skinResponseValue.push(skinResponseCurrent);
                setCurrentSkinResponse(skinResponseCurrent);

                currentVal = currentVal.substr(delimIndex + 1);
                delimIndex = currentVal.indexOf('_');

                /* console.info(
                   'PPG Current: ' + ppgCurrent,
                   ' \t SkinResponse Current : ' + skinResponseCurrent,
                   ' \t current Val : ' + ppgValue.length,
                 );*/
              }
              else {
                if (ppgValue.length === 750) {
                  ppgValue.push(0);
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
                      isBefore: CONFIG.isBefore
                    }),
                  })
                    .then((response) => response.json())
                    .then((responseData) => {
                      console.info(JSON.stringify(responseData, null, 2));
                      if (responseData.message === 'PPG Added Successfully') {
                        console.info("PPG Added Successfully");
                        Alert.alert("Nabız verisi alındı");
                      } else {
                        Alert.alert(getString('unknownErrorOccured'));
                      }
                    })
                    .catch((error) => {
                      setRequestActive(false);
                      Alert.alert(getString('checkNetwork'));
                    });

                }

              }

            } else {
              let delimIndex = currentVal.indexOf('_');

              let leftCurrent = currentVal.substr(0, delimIndex);
              currentVal = currentVal.substr(delimIndex + 1);
              delimIndex = currentVal.indexOf('_');

              let rightCurrent = currentVal.substr(0, delimIndex);
              currentVal = currentVal.substr(delimIndex + 1);
              delimIndex = currentVal.indexOf('_');

              let voltageFeedback = currentVal.substr(0, delimIndex);
              currentVal = currentVal.substr(delimIndex + 1);
              delimIndex = currentVal.indexOf('_');

              let onOffStatus = currentVal.substr(0, delimIndex);
              let timeLeft = Math.ceil(
                parseInt(currentVal.substr(delimIndex + 1), 10),
              );

              let lConnected =
                parseInt(leftCurrent, 10) >= headphoneCurrentThreshold ||
                onOffStatus === 'off' ||
                onOffStatus === 'idle';

              let rConnected =
                parseInt(rightCurrent, 10) >= headphoneCurrentThreshold ||
                onOffStatus === 'off' ||
                onOffStatus === 'idle';


              setStimOffTime(onOffStatus === 'off');
              setHeadLConnected(lConnected);
              setHeadRConnected(rConnected);
              setRemDuration(timeLeft);

              leftCurrent = (leftCurrent / 1000).toFixed(2);
              rightCurrent = (rightCurrent / 1000).toFixed(2);

              setLeftCurrentMA(leftCurrent);
              setRightCurrentMA(rightCurrent);

              /*console.info(
                'Headphone currents: ' + leftCurrent,
                ' mA, ',
                rightCurrent,
                ' mA\t Voltage FB: ',
                voltageFeedback,
                '\tStatus: ' + onOffStatus,
                '\tTime Left: ' + timeLeft,
              );*/
            }
          }
        },
        bleInstance.STATUS_CHAR2_UUID,
      );
    }
  };

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
          console.info('Ble Control - Read config: ' + stateVal);

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
          setDevTotalDur(parseInt(charStr, 10));
          setRemDuration(parseInt(charStr, 10));

          //Retrieve voltage
          charIndex = stateVal.indexOf(bleInstance.voltageChar);
          charStr = stateVal.substr(
            charIndex + 1,
            stateVal.indexOf(';', charIndex) - charIndex - 1,
          );
          setDevVoltage(parseInt(charStr, 10));

          //Retrieve left intensity
          let leftCharIndex = stateVal.indexOf(bleInstance.leftIntensityChar);
          let leftProgStr = stateVal.substr(
            leftCharIndex + 1,
            stateVal.indexOf(';', leftCharIndex) - leftCharIndex - 1,
          );
          leftProgressEmbedded = parseInt(leftProgStr, 10) / 10;

          //Retrieve right intensity
          let rightCharIndex = stateVal.indexOf(bleInstance.rightIntensityChar);
          let rightProgStr = stateVal.substr(
            rightCharIndex + 1,
            stateVal.indexOf(';', rightCharIndex) - rightCharIndex - 1,
          );
          rightProgressEmbedded = parseInt(rightProgStr, 10) / 10;

          readDeviceState();

        })
        .catch((error) => {
          console.info('Read conf error: ' + error);

          setTimeout(() => {
            readConfigurations();
          }, readFieldDelay);
        });
    }
  };

  const readDeviceState = () => {
    if (bleInstance.connectedDevice !== null) {
      bleInstance.connectedDevice
        .readCharacteristicForService(
          bleInstance.CONTROL_SERVICE_UUID,
          bleInstance.CONTROL_CHAR1_UUID,
          bleInstance.CONTROL_CHAR1_UUID,
        )
        .then((characteristic) => {
          let stateVal = Buffer.from(characteristic.value, 'base64').toString();
          console.info('Read state: ' + stateVal);

          if (stateVal === 'stop') {
            CONFIG.stimInProgress = false;
            setStimStarted(false);
            setStimPaused(false);
          } else if (stateVal === 'fin') {
            stimFinished();
          } else if (stateVal === 'start') {
            if (gotSuggest) {
              setRemDuration(suggestTotalDur);
            } else {
              setRemDuration(devTotalDur);
            }
            CONFIG.stimInProgress = true;
            setStimStarted(true);
            setStimPaused(false);
          } else if (stateVal === 'pause') {
            CONFIG.stimInProgress = false;
            setStimStarted(false);
            setStimPaused(true);
            setLeftProgress(leftProgressEmbedded);
            setRightProgress(rightProgressEmbedded);
          } else {
            CONFIG.stimInProgress = true;
            setStimStarted(true);
            setStimPaused(false);
            setLeftProgress(leftProgressEmbedded);
            setRightProgress(rightProgressEmbedded);
          }

          readDeviceVersion();
        })
        .catch((error) => {
          console.info('Read dev state error: ' + error);

          setTimeout(() => {
            readDeviceState();
          }, readFieldDelay);
        });
    }
  };

  const readDeviceVersion = () => {
    if (bleInstance.connectedDevice !== null) {
      bleInstance.connectedDevice
        .readCharacteristicForService(
          bleInstance.STATUS_SERVICE_UUID,
          bleInstance.STATUS_CHAR0_UUID,
          bleInstance.STATUS_CHAR0_UUID,
        )
        .then((characteristic) => {
          let stateVal = Buffer.from(characteristic.value, 'base64').toString();

          let delimIndex = stateVal.indexOf('_');

          if (delimIndex !== -1) {
            CONFIG.embeddedVersion = stateVal.substr(0, delimIndex);
            CONFIG.embeddedMAC = stateVal.substr(delimIndex + 1);
          } else {
            CONFIG.embeddedVersion = stateVal;
            CONFIG.embeddedMAC = 'old-version';
          }

          console.info('Embedded Version: ' + CONFIG.embeddedVersion);
          console.info('Embedded MAC: ' + CONFIG.embeddedMAC);

          sendDeviceInfo();
        })
        .catch((error) => {
          console.info('Err Device version: ' + error);

          setTimeout(() => {
            readDeviceVersion();
          }, readFieldDelay);
        });
    }
  };

  const sendDeviceInfo = () => {
    fetch(CONFIG.baseServer + 'api/2.0/devices/add', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + CONFIG.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId: CONFIG.embeddedMAC,
        currentVersion: CONFIG.embeddedVersion,
      }),
    })
      .then((response) => {
        if (response.status === 426) {
          console.info('Update needed');
          if (!CONFIG.skipUpdate) {
            navigation.navigate('FwUpdate');
          }
        } else {
          console.info('No update');
        }
      })
      .catch((error) => {
        console.info(error);
      });
  };

  const connectAnalytics = async () => {
    const enabled = await Analytics.isEnabled();
    console.info("Analytics Enabled : " + enabled);
  }

  const stimFinished = async () => {
    console.info('stim finished');
    suggestDone();
    CONFIG.stimInProgress = false;
    setStimStarted(false);
    setStimPaused(false);

    if (!isFinishMessageSent) {
      sendLog('finish');
      isFinishMessageSent = true;
    }

    if (gotSuggest) {
      setRemDuration(suggestTotalDur);
    } else {
      setRemDuration(devTotalDur);
    }

    if (!CONFIG.stimFinishedDialog) {
      CONFIG.stimFinishedDialog = true;

      setTimeout(() => {
        navigation.navigate('StimEnd');
      }, stimFinishedTimeout);
    }
  };

  const suggestDone = () => {
    console.info('suggest done');
    fetch(CONFIG.baseServer + 'api/2.0/suggests/done/' + CONFIG.suggestId, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + CONFIG.token,
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        if (response.status == 200) {
          console.info("Suggest done successfully")
        } else {
          console.info("Suggest done failed")
        }
      })
  }


  const sendLog = (logType) => {
    let curExactDuration = gotSuggest ? (suggestTotalDur - remDuration) : (devTotalDur - remDuration);
    if (curExactDuration < 0) {
      curExactDuration = 0;
    }

    fetch(CONFIG.baseServer + 'api/2.0/backlogs/add', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + CONFIG.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: logType,
        actionTime: new Date().toISOString(),
        expectedDuration: gotSuggest ? suggestTotalDur : devTotalDur,
        exactDuration: curExactDuration,
        intensityLimit: leftProgress,
        frequency: gotSuggest ? suggestFreq : devFreq,
        offDuration: gotSuggest ? suggestOffDur : (60 - devOnDur),
        onDuration: gotSuggest ? suggestOnDur : devOnDur,
        pulseWidth: gotSuggest ? suggestPulse : devPulse,
        deviceId: CONFIG.embeddedMAC,
        deviceVersion: CONFIG.embeddedVersion,
        patientId: CONFIG.patientId,
        stimulationId: CONFIG.stimulationId,
      }),
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.info(JSON.stringify(responseData, null, 2));
      })
      .catch((error) => {
        console.info(error);
      });
  };

  const getConfigString = (onlyIntensity) => {
    let confString =
      bleInstance.leftIntensityChar +
      String(leftProgress * 10) +
      ';' +
      bleInstance.rightIntensityChar +
      String(rightProgress * 10) +
      ';';

    if (!onlyIntensity) {
      confString += bleInstance.pulseWidthChar + String(suggestPulse) + ';';
      confString += bleInstance.frequencyChar + String(suggestFreq) + ';';
      confString += bleInstance.durOnChar + String(suggestOnDur) + ';';
      confString += bleInstance.durOffChar + String(suggestOffDur) + ';';
      confString += bleInstance.totalDurationChar + String(suggestTotalDur) + ';';
    }

    confString += '+' + confString.length;
    return confString;
  };

  const pressedStartStim = () => {
    if (!stimStarted || stimPaused) {
      //Enable showning stim finished, this indicates new stimulation.
      CONFIG.stimFinishedDialog = false;

      let configString = '';

      if (gotSuggest && !CONFIG.adminUpdatedSettings) {
        connectAnalytics();
        Analytics.trackEvent("Stim started by : " + CONFIG.userMail);
        console.info('Got suggest, sending params');
        configString = getConfigString(false);
      } else {
        console.info('No suggest, no params');
        configString = getConfigString(true);
      }

      //Send config
      bleInstance
        .writeStringData(
          configString,
          bleInstance.CONTROL_SERVICE_UUID,
          bleInstance.CONTROL_CHAR0_UUID,
        )
        .then((response) => {
          console.info('Sent config successfully: ' + configString);

          //Start stim
          bleInstance
            .writeStringData(
              'start',
              bleInstance.CONTROL_SERVICE_UUID,
              bleInstance.CONTROL_CHAR1_UUID,
            )
            .then((startStimResponse) => {
              console.info('Started stim successfully');
              CONFIG.stimInProgress = true;
              isFinishMessageSent = false;
              setBleTextIndex(1);
              setStimStarted(true);
              setStimPaused(false);
              sendLog('start');
            })
            .catch((error) => {
              console.info('Stim start error: ' + error);
            });
        })
        .catch((error) => {
          console.info('Send config error: ' + error);
          Alert.alert(getString('startError'));
        });
    }
  };

  const pressedStopStim = () => {
    if (stimStarted) {
      if (stimPaused) {
        bleInstance
          .writeStringData(
            'stop',
            bleInstance.CONTROL_SERVICE_UUID,
            bleInstance.CONTROL_CHAR1_UUID,
          )
          .then((response) => {
            setHeadLConnected(true);
            setHeadRConnected(true);
            setStimStarted(false);
            setStimPaused(false);
            setLeftProgress(0);
            setRightProgress(0);
            CONFIG.stimInProgress = false;
            sendLog('stop');
          })
          .catch((error) => {
            console.info('Stim stop error: ' + error);
          });
      } else {
        bleInstance
          .writeStringData(
            'pause',
            bleInstance.CONTROL_SERVICE_UUID,
            bleInstance.CONTROL_CHAR1_UUID,
          )
          .then((response) => {
            setHeadLConnected(true);
            setHeadRConnected(true);
            setStimPaused(true);
            sendLog('pause');
          })
          .catch((error) => {
            console.info('Stim pause error: ' + error);
          });
      }
    }
  };

  const pressedMinus = () => {
    if (headphoneLSelected) {
      if (leftProgress > 0) {
        setLeftProgress((prev) => prev - 1);
      }
    } else {
      if (rightProgress > 0) {
        setRightProgress((prev) => prev - 1);
      }
    }
  };

  const pressedPlus = () => {
    if (headphoneLSelected) {
      if (leftProgress < intensityProgressMaxValue) {
        setLeftProgress((prev) => prev + 1);
      }
    } else {
      if (rightProgress < intensityProgressMaxValue) {
        setRightProgress((prev) => prev + 1);
      }
    }
  };

  const onSwipeLeft = () => {
    if (stimStarted && bleTextIndex < 2) {
      setBleTextIndex((prevIndex) => (prevIndex + 1));
    }
  };

  const onSwipeRight = () => {
    if (stimStarted && bleTextIndex > 0) {
      setBleTextIndex((prevIndex) => (prevIndex - 1));
    }
  };

  const getBatteryIconName = () => {
    let batLevelInt = parseInt(batteryLevel, 10);
    if (batLevelInt === 0) {
      return 'battery-0';
    } else if (batLevelInt < 25) {
      return 'battery-1';
    } else if (batLevelInt < 50) {
      return 'battery-2';
    } else if (batLevelInt < 75) {
      return 'battery-3';
    } else if (batLevelInt <= 100) {
      return 'battery-4';
    }
  };

  return (
    <Container>
      <CommonHeader
        text={getString('deviceControl')}
        isBackActive={!CONFIG.userRole.includes("ROLE_RESEARCHER")}
        onPressBack={() => {
          navigation.navigate('BleConnected');
        }}
        onPressSettings={() => {
          navigation.navigate('AdminPanel');
        }}
        isSettingsActive={CONFIG.userRole !== 'ROLE_USER'}
      />
      <Content contentContainerStyle={styles.content}>
        <View style={styles.iconView}>
          {CONFIG.userRole.includes("ROLE_RESEARCHER") ?
            <TouchableOpacity onPress={() => {
              navigation.navigate('BleSearchDevices');
            }}>
              <Icon
                style={styles.bluetoothIconStyle}
                type="MaterialCommunityIcons"
                name={'bluetooth-connect'}
              />
            </TouchableOpacity>
            :
            <Icon
              style={styles.bluetoothIconStyle}
              type="MaterialCommunityIcons"
              name={'bluetooth-connect'}
            />}
          <Icon
            style={styles.batIconStyle}
            type="FontAwesome"
            name={getBatteryIconName()}
          />
        </View>
        <GestureRecognizer
          onSwipeLeft={() => onSwipeLeft()}
          onSwipeRight={() => onSwipeRight()}
          config={config}
          style={styles.textView}
        >
          {/**  <BluetoothText isStimStarted={stimStarted} textIndex={bleTextIndex} />  */}
          <CountdownCircleTimer
            isPlaying
            duration={70}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[70, 50, 20, 0]}
          >
            {({ remainingTime }) => <Text>{remainingTime}</Text>}
          </CountdownCircleTimer>
        </GestureRecognizer>

        <View style={styles.controlView}>
          <ControlPanel
            isStimStarted={stimStarted}
            isStimPaused={stimPaused}
            onPressStart={() => {
              pressedStartStim();
            }}
            onPressStop={() => {
              pressedStopStim();
            }}
            remainingTime={remDuration}
            leftCurrent={currentPpg}
            rightCurrent={currentSkinResponse}
            isAdmin={true}
          />
        </View>
        <View style={styles.headphoneSelectView}>
          <HeadphoneSelect
            isLeftSelected={headphoneLSelected}
            onPressLeft={() => {
              setHeadphoneLSelected(true);
            }}
            onPressRight={() => {
              setHeadphoneLSelected(false);
            }}
          />
        </View>
        <View style={styles.intensityView}>
          <HeadphoneControl
            isStimStarted={stimStarted}
            onPressedMinus={() => {
              pressedMinus();
            }}
            onPressedPlus={() => {
              pressedPlus();
            }}
            currentProgress={headphoneLSelected ? leftProgress : rightProgress}
            isLeft={headphoneLSelected}
            isLeftConnected={headLConnected}
            isRightConnected={headRConnected}
            isOffTime={stimOffTime}
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
    flex: 15,
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

export default BleControl;
