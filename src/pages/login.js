import React, { useState, useEffect } from 'react';
import { Text, StatusBar, Keyboard, View, Image, StyleSheet } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Container, Content } from 'native-base';

import CommonButton from '../components/commonbutton.js';
import CommonTextInput from '../components/commontextinput.js';

import { CONFIG } from '../data/config';
import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';
import { getString } from '../data/strings';

import AwesomeAlert from 'react-native-awesome-alerts';

import { Linking } from 'react-native';
import DeepLinking from 'react-native-deep-linking';
import SplashScreen from 'react-native-splash-screen';

const Login = ({ navigation }) => {

  SplashScreen.hide();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requestActive, setRequestActive] = useState(false);

  useEffect(() => {
    DeepLinking.addScheme('https://');
    Linking.addEventListener('url', handleUrl);
  }, []);

  const handleUrl = ({ url }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        if (url.split('/')[4] === "resetPassword") {
          CONFIG.resetPasswordToken = url.split('/')[5];
          navigation.navigate("ResetPassword");
        } else if (url.split('/')[4] === "registration") {
          CONFIG.confirmationToken = url.split('/')[5];
          navigation.navigate("ConfirmEmail");
        }
      }
    });
  };

  //Set to true to skip auth process
  const debugSkipLogin = false;

  const emailAsyncKey = 'email-key';
  const passAsyncKey = 'pass-key';


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
        openAlert(getString('incorrectCredExp'));
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
          CONFIG.patientId = responseData.patientId;
          CONFIG.name = responseData.name;
          CONFIG.surname = responseData.surname;
          CONFIG.isNewUser = responseData.newUser;
          authSuccessful();
        } else if (responseData.message === 'Please confirm your email') {
          openAlert(getString('confirmEmail'));
        } else if (responseData.message === 'Email or password incorrect') {
          setPassword('');
          openAlert(getString('incorrectCredTitle'));
        } else {
          setPassword('');
          openAlert(getString('unknownErrorOccured'));
        }
      })
      .catch((error) => {
        console.info(error);
        setRequestActive(false);
        openAlert(getString('checkNetwork'));
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
      } else if (CONFIG.patientId === 0 || CONFIG.patientId === null) {
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
    <Container>
      <StatusBar backgroundColor={COLORS.vagustimBlue} />
      <Content contentContainerStyle={styles.content}>
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
            inputWidth={'70%'}
          />
          <CommonTextInput
            text={password}
            onChangeText={(text) => setPassword(text)}
            secureEntry={true}
            forgotPassword={true}
            onPressForgot={forgotHandler}
            placeholderText={getString('password')}
            inputWidth={'70%'}
          />
          <CommonButton
            text={getString('login')}
            onPress={loginHandler}
            buttonColor={COLORS.buttonBlue}
            buttonWidth={'50%'}
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
