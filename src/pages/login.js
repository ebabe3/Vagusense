import React, { useState, useEffect } from 'react';
import { Text, Keyboard, View, Image, StyleSheet, Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Container } from 'native-base';

import CommonButton from '../components/commonbutton.js';
import CommonTextInput from '../components/commontextinput.js';


import { CONFIG } from '../data/config';
import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';
import { getString } from '../data/strings';

import { Linking } from 'react-native';

const Login = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requestActive, setRequestActive] = useState(false);

  //Set to true to skip auth process
  const debugSkipLogin = false;

  const emailAsyncKey = 'email-key';
  const passAsyncKey = 'pass-key';

  useEffect(() => {
    getCredentials();
  }, []);

  const getCredentials = async () => {
    let recoveredEmail = await AsyncStorage.getItem(emailAsyncKey);
    let recoveredPassword = await AsyncStorage.getItem(passAsyncKey);
    if (recoveredEmail && recoveredPassword) {
      setEmail(recoveredEmail);
      setPassword(recoveredPassword);
    }
  };

  const forgotHandler = () => {
    navigation.navigate('Forgot');
  };

  const loginHandler = () => {
    if (requestActive) {
      return;
    }
    new Promise((resolve, reject) => {
      Keyboard.dismiss();
      setTimeout(resolve, 25);
    }).then(async () => {
      if (email.length > 0 && password.length > 0) {
        if (debugSkipLogin) {
          authSuccessful();
        } else {
          requestLogin();
        }
      } else {
        Alert.alert(getString('incorrectCredExp'));
      }
    });
  };

  const requestLogin = () => {
    setRequestActive(true);
    fetch(CONFIG.baseServer + 'api/users/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setRequestActive(false);
        console.info(JSON.stringify(responseData, null, 2));

        if (responseData.message === 'Login success') {
          CONFIG.selectedSubuserNameSurname = responseData.name + " " + responseData.surname;
          CONFIG.token = responseData.token;
          CONFIG.userRole = responseData.role;
          CONFIG.subuserId = responseData.subuserId;
          CONFIG.name = responseData.name;
          CONFIG.surname = responseData.surname;
          CONFIG.isNewUser = responseData.newUser;
          authSuccessful();
        } else if (responseData.message === 'Please confirm your email') {
          Alert.alert(getString('confirmEmail'));
        } else if (responseData.message === 'Email or password incorrect') {
          setPassword('');
          Alert.alert(getString('incorrectCredTitle'));
        } else {
          setPassword('');
          Alert.alert(getString('unknownErrorOccured'));
        }
      })
      .catch((error) => {
        console.info(error);
        setRequestActive(false);
        Alert.alert(getString('checkNetwork'));
      });
  };

  const authSuccessful = async () => {
    CONFIG.userMail = email;
    CONFIG.userPass = password;

    await AsyncStorage.setItem(emailAsyncKey, email);
    await AsyncStorage.setItem(passAsyncKey, password);

    if (CONFIG.userRole.includes("ROLE_RESEARCHER")) {
      navigation.navigate('BleSearchDevices');
    } else if (CONFIG.userRole === "ROLE_USER") {
      if (CONFIG.name === null || CONFIG.name === "" || CONFIG.name === "null") {
        navigation.navigate('UpdateAccount');
      } else if (CONFIG.subuserId === 0 || CONFIG.subuserId === null) {
        navigation.navigate('CreateUser', {
          isEdit: false,
        });
      } else if (CONFIG.isNewUser) {
        navigation.navigate('UpdateEndUser', {
          isEdit: false,
        })
      } else {
        navigation.navigate('UserPage', {
          isEdit: false,
        });
      }
    } else {
      navigation.navigate('ListUsers');
    }
  };

  return (
    <Container  style={styles.content}>
        <View style={styles.imageView}>
          <Image
            style={styles.imageStyle}
            source={require('../images/logo.jpg')}
          />
        </View>
        <View style={styles.inputAndButtonView}>
          <CommonTextInput
            text={email}
            onChangeText={(text) => setEmail(text)}
            placeholderText={getString('email')}
            inputWidth={'100%'}
          />
          <CommonTextInput
            text={password}
            onChangeText={(text) => setPassword(text)}
            secureEntry={true}
            forgotPassword={true}
            onPressForgot={forgotHandler}
            placeholderText={getString('password')}
            inputWidth={'100%'}
          />
          <CommonButton
            text={getString('login')}
            onPress={loginHandler}
            buttonColor={COLORS.buttonBlue}
            buttonWidth={'90%'}
            buttonMarginTop={54}
          />
          <View style={styles.signupView}>
            <Text style={styles.dontHaveText}>
              {getString('dontHaveAcc')}
              {'    '}
              <Text
                style={styles.signupText}
                onPress={() => {
                  navigation.navigate('Register');
                }}>
                {getString('signup')}
              </Text>
            </Text>
          </View>
        </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: '60%',
    height: undefined,
    aspectRatio: 1000 / 243,
    marginTop: 24,
    marginBottom: 16,
  },
  imageView: {
    flex: 1,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputAndButtonView: {
    flex: 1,
    width: '85%',
    alignItems: 'center',
  },
  signupView: {
    flex: 1,
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  dontHaveText: {
    fontSize: 16,
    fontFamily: DEFAULT_FONT,
    color: COLORS.darkText,
  },
  signupText: {
    fontSize: 16,
    fontFamily: DEFAULT_FONT,
    color: COLORS.blueTextColor,
  },
});

export default Login;
