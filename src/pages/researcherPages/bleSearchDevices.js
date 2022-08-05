import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Linking,
    PermissionsAndroid,
    Platform,
} from 'react-native';

import { Container, Content } from 'native-base';
import { BluetoothStatus } from 'react-native-bluetooth-status';

import CommonButton from '../../components/commonbutton.js';
import CommonHeader from '../../components/commonheader.js';

import { getString } from '../../data/strings';
import { COLORS } from '../../style/colors';
import { DEFAULT_FONT } from '../../style/fonts';
import { CONFIG } from '../../data/config';
import FastImage from 'react-native-fast-image';

import AwesomeAlert from 'react-native-awesome-alerts';
import MyBleManager from '../../components/ble.js';

const BleSearchDevices = ({ navigation, route }) => {
    const bleConnCheckInterval = 500;

    const bleInstance = MyBleManager.instance;

    //Alert
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAllertMessage] = useState('');

    openAlert = (alertMessage) => {
        setShowAlert(true);
        setAllertMessage(alertMessage);
    }

    hideAlert = () => {
        setShowAlert(false);
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            bleInstance.isSearchedForResearchers = false;
            initBluetooth();
        });
    }, []);

    useEffect(() => {
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
            ).then((granted) => {
                console.log("BLUETOOTH_CONNECT")
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
                ).then((granted) => {
                    console.log("BLUETOOTH_SCAN")
                    PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE
                    ).then((granted) => {
                        console.log("BLUETOOTH_ADVERTISE")
                        
                        PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                        ).then((granted) => {
            
                            console.log("ACCESS_FINE_LOCATION")
            
                            initBluetooth();
                        });
                        
                    });
                    
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
            searchDevices();
        } else if (!isEnabled && Platform.OS === 'android') {
            BluetoothStatus.enable();
            setTimeout(() => {
                searchDevices();
            }, 5000);
        } else {
            setTimeout(() => {
                searchDevices();
            }, 5000);
            openAlert(getString('checkBluetooth'));
        }
    };

    const searchDevices = () => {
        bleInstance.searchDevices();
        waitBleInstanceSearching();
    };

    const waitBleInstanceSearching = () => {
        if (bleInstance.isSearchedForResearchers) {
            navigation.navigate('ListDevices');
        } else {
            setTimeout(() => {
                waitBleInstanceSearching();
            }, bleConnCheckInterval);
        }
    };

    const getBLEImage = () => {
        return (
            <View style={styles.imageView}>
                <FastImage
                    style={styles.gifStyle}
                    source={require('../../images/bluetooth.gif')}
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
                    <Text style={styles.searchingText}>{"Searching for your devices"}</Text>
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
                    {/* Alert Component */}
                    <AwesomeAlert
                        show={showAlert}
                        showProgress={false}
                        message={alertMessage}
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={false}
                        showConfirmButton={true}
                        confirmText="Close"
                        confirmButtonColor="#DD6B55"
                        onCancelPressed={() => {
                            hideAlert();
                        }}
                        onConfirmPressed={() => {
                            hideAlert();
                        }}
                        onDismiss={() => {
                            hideAlert();
                        }}
                    />
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

export default BleSearchDevices;
