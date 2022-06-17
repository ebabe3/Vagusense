import React, { useState } from 'react';
import { Text, StatusBar, Keyboard, View, Image, StyleSheet, Alert } from 'react-native';

import { Container } from 'native-base';

import CommonButton from '../components/commonbutton.js';
import CommonTextInput from '../components/commontextinput.js';

import { CONFIG } from '../data/config';
import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';
import { getString } from '../data/strings';

import * as Progress from 'react-native-progress';

const Forgot = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [requestActive, setRequestActive] = useState(false);


  const validateEmail = (emailText) => {
    let re = /\S+@\S+\.\S+/;
    return re.test(emailText);
  };

  const resetHandler = () => {
    Keyboard.dismiss();
    if (requestActive) {
      return;
    }

    if (validateEmail(email)) {
      sendResetRequest();
    } else {
      setEmail('');
      Alert.alert(getString('emailNotValid'));
    }
  };

  const sendResetRequest = () => {
    setRequestActive(true);
    fetch(CONFIG.baseServer + 'api/2.0/users/resetPassword?email=' + email, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setRequestActive(false);
        console.info(JSON.stringify(responseData, null, 2));
        if (responseData.message === 'Mail Sended') {
          navigation.navigate('CheckEmail', { isReset: true });
        } else if (responseData.message === 'email not found') {
          Alert.alert(getString('emailNotFound'));
        } else {
          Alert.alert(getString('unknownErrorOccured'));
        }
      })
      .catch((error) => {
        setRequestActive(false);
        Alert.alert(getString('checkNetwork'));
      });
  };

  return (
    <Container style={styles.content}>
      <StatusBar backgroundColor={COLORS.vagustimBlue} />
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
          {requestActive ?
            <Progress.Circle size={50} indeterminate={true} style={styles.progressStyle} />
            :
            <CommonButton
              text={getString('resetMyPassword')}
              onPress={resetHandler}
              buttonColor={COLORS.buttonGreen}
              buttonWidth={'90%'}
              buttonMarginTop={54}
            />}

          <View style={styles.rememberView}>
            <Text style={styles.rememberText}>
              {getString('rememberPassword')}
              {'    '}
              <Text
                style={styles.loginText}
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                {getString('login')}
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
  rememberView: {
    flex: 1,
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  rememberText: {
    fontSize: 16,
    fontFamily: DEFAULT_FONT,
    color: COLORS.darkText,
  },
  loginText: {
    fontSize: 16,
    fontFamily: DEFAULT_FONT,
    color: COLORS.blueTextColor,
  },
  progressStyle: {
    marginTop: 44,
    color: COLORS.buttonGreen
  }
});

export default Forgot;
