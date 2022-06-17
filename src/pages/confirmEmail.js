import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, StatusBar, Alert } from 'react-native';

import { Container, Content } from 'native-base';

import CommonButton from '../components/commonbutton.js';

import { CONFIG } from '../data/config';
import { getString } from '../data/strings';
import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';


const ConfirmEmail = ({ navigation }) => {

    const [verificationStatus, setVerificationStatus] = useState(false);

    useEffect(() => {
        sendConfirmRequest();
    }, []);


    const sendConfirmRequest = () => {
        fetch(CONFIG.baseServer + `registrationConfirm/${CONFIG.confirmationToken}`, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.info(JSON.stringify(responseData, null, 4));
                if (responseData === true) {
                    setVerificationStatus(true);
                    Alert.alert(getString('emailVerificationSuccess'));
                } else {
                    setVerificationStatus(false);
                    Alert.alert(getString('emailVerificationFailed'));
                }
            })
            .catch((error) => {
                Alert.alert(getString('checkNetwork'));
            });
    };

    const loginHandler = () => {
        navigation.navigate('Login');
    };


    return (
        <Container>
            <StatusBar backgroundColor={COLORS.vagustimBlue} />
            <Content contentContainerStyle={styles.content}>
                <Text style={styles.checkEmailText}>
                    {verificationStatus
                        ? getString('emailVerificationSuccess')
                        : getString('emailVerificationFailed')}
                </Text>
                <CommonButton
                    text={getString('login')}
                    onPress={loginHandler}
                    buttonColor={COLORS.buttonBlue}
                    buttonWidth={'90%'}
                />
            </Content>
        </Container>
    );

}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '85%',
    },
    checkEmailText: {
        fontSize: 19,
        textAlign: 'center',
        fontFamily: DEFAULT_FONT,
        color: COLORS.darkerTextColor,
        marginBottom: 48,
    },
    checkExpText: {
        fontSize: 19,
        textAlign: 'center',
        fontFamily: DEFAULT_FONT,
        color: COLORS.lightTextColor,
        marginBottom: 48,
    },
});

export default ConfirmEmail;