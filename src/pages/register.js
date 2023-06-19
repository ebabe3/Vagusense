import React, { useState } from 'react';
import {
  Text,
  StatusBar,
  Keyboard,
  View,
  Image,
  StyleSheet,
  Switch,
  Linking,
  Alert,
} from 'react-native';

import { Container, Content } from 'native-base';

import CommonButton from '../components/commonbutton.js';
import CommonTextInput from '../components/commontextinput.js';

import { CONFIG } from '../data/config';
import { getString } from '../data/strings';
import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';


import TextBox from 'react-native-password-eye';

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requestActive, setRequestActive] = useState(false);
  const [userType, setUserType] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [passwordAlertType, setPasswordAlertType] = useState(null);
  const [confirmPasswordAlertType, setConfirmPasswordAlertType] = useState(null);
  const [textBoxPasswordHint, setTextBoxPasswordHint] = useState(' ');
  const [textBoxConfirmPasswordHint, setTextBoxConfirmPasswordHint] = useState(' ');

  const minPWLength = 8;


  const onChangePassword = (text) => {
    if (text != null && (text.length >= 1 && text.length <= 3)) {
      setPasswordAlertType('error');
      setTextBoxPasswordHint(' ');
    } else if (text == null || text == '') {
      setPasswordAlertType(null);
      setTextBoxPasswordHint(' ');
    }
    else if (text.length > 3 && text.length < 8 || !/[A-Z]/.test(text) || !/[a-z]/.test(text) || !/\d/.test(text)) {
      if (!/[A-Z]/.test(text)) {
        setPasswordAlertType('warning');
        setTextBoxPasswordHint(getString('passwordUppercaseError'));
      }
      else if (!/[a-z]/.test(text)) {
        setPasswordAlertType('warning');
        setTextBoxPasswordHint(getString('passwordLowercaseError'));
      }
      else if (!/\d/.test(text)) {
        setPasswordAlertType('warning')
        setTextBoxPasswordHint(getString('passwordNumberError'));
      } else {
        setTextBoxPasswordHint(getString('passwordLenghtError'));
      }
    } else if (text.length >= 8 && /\d/.test(text) && /[a-z]/.test(text) && /[A-Z]/.test(text)) {
      setPasswordAlertType('success');
      setTextBoxPasswordHint(' ');
    }
  }

  const onChangeConfirmPassword = (text) => {
    if (text !== password) {
      setConfirmPasswordAlertType('error');
      setTextBoxConfirmPasswordHint('Passwords Mismatch');
    } else if (text == null || text == '') {
      setTextBoxConfirmPasswordHint(' ');
      setConfirmPasswordAlertType(null);
    } else {
      setConfirmPasswordAlertType('success');
      setTextBoxConfirmPasswordHint(' ');
    }
  }



  const validateEmail = (emailText) => {
    let re = /\S+@\S+\.\S+/;
    return re.test(emailText);
  };

  const registerHandler = () => {
    Keyboard.dismiss();
    if (requestActive) {
      return;
    }

    if (password !== confirmPassword) {
      setPassword('');
      setConfirmPassword('');
      Alert.alert(getString('passwordNoMatch'));
      return;
    }

    if (!isEnabled) {
      Alert.alert(getString('acceptTerms'));
      return;
    }

    if (userType === 0) {
      Alert.alert(getString('selectUserType'));
      return;
    }

    if (validateEmail(email)) {
      if (password.length >= minPWLength) {

        sendRegisterRequest();
      } else {
        Alert.alert(getString('passwordTooShort'));
      }
    } else {
      setEmail('');
      setPassword('');
      Alert.alert(getString('emailNotValid'));
    }
  };

  const sendRegisterRequest = () => {
    setRequestActive(true);
    fetch(CONFIG.baseServer + 'api/users/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        annons: true,
        email: email,
        name: name,
        password: password,
        roleName: userType === 1 ? "ROLE_PHYSIOTHERAPIST_ECO" : "ROLE_USER",
        surname: lastname,
        terms: true,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setRequestActive(false);
        console.info(JSON.stringify(responseData, null, 2));
        if (responseData.message === 'Registration success') {
          navigation.navigate('CheckEmail', { isReset: false });
        } else if (responseData.status === 400) {
          console.info(responseData.validationErrors);
          Alert.alert(getString('passwordNotValid'));
        } else if (responseData.message === 'User already registered') {
          Alert.alert(getString('userAlreadyRegistered'));
        } else {
          Alert.alert(getString('unknownErrorOccured'));
        }
      })
      .catch((error) => {
        console.error(error);
        setRequestActive(false);
        Alert.alert(getString('checkNetwork'));
      });
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
            text={name}
            onChangeText={(text) => setName(text)}
            placeholderText={getString('name')}
            inputWidth={'100%'}
          />
          <CommonTextInput
            text={lastname}
            onChangeText={(text) => setLastname(text)}
            placeholderText={getString('lastname')}
            inputWidth={'100%'}
          />
          <CommonTextInput
            text={email}
            onChangeText={(text) => setEmail(text)}
            placeholderText={getString('email')}
            inputWidth={'100%'}
          />
          <TextBox
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => {
              setPassword(text);
              onChangePassword(text);

            }}
            placeholderTextColor={COLORS.lightTextColor}
            alertType={passwordAlertType}
            iconSuccess={'check'}
            hint={textBoxPasswordHint}
            hintColor='#DD6B55'
            containerStyles={[styles.containerStyles1]}
            inputStyle={[styles.inputStyle]}
          />

          <TextBox
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={(text) => {
              setConfirmPassword(text);
              onChangeConfirmPassword(text);

            }}
            placeholderTextColor={COLORS.lightTextColor}
            alertType={confirmPasswordAlertType}
            iconSuccess={'check'}
            hint={textBoxConfirmPasswordHint}
            hintColor='#DD6B55'
            containerStyles={[styles.containerStyles2]}
            inputStyle={[styles.inputStyle]}
          />
          <View style={styles.expView}>
            <Text style={styles.expText}>{getString('passwordExp')}</Text>
          </View>
          <View style={styles.userSelectView}>
            <CommonButton
              text={getString('healthProfessional')}
              textColor={COLORS.blueTextColor}
              onPress={() => { setUserType(1); }}
              buttonBorderColor={COLORS.blueTextColor}
              buttonBorderWidth={1}
              buttonHeight={45}
              buttonFontSize={13}
              buttonColor={userType === 1 ? COLORS.greySelectColor : 'white'}
              buttonWidth={'48%'}
              buttonMarginTop={0}
            />
            <CommonButton
              text={getString('endUser')}
              textColor={COLORS.blueTextColor}
              onPress={() => { setUserType(2); }}
              buttonBorderColor={COLORS.blueTextColor}
              buttonBorderWidth={1}
              buttonHeight={45}
              buttonFontSize={13}
              buttonColor={userType === 2 ? COLORS.greySelectColor : 'white'}
              buttonWidth={'48%'}
              buttonMarginTop={0}
            />
          </View>
          <View style={styles.termsView}>
            <Switch
              style={styles.switchStyle}
              trackColor={{
                false: COLORS.disabledSwitchColor,
                true: COLORS.activeSwitchColor,
              }}
              thumbColor={'#FFFFFF'}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
            <Text style={styles.agreeText}>
              {getString('agreeToVagustim')}{' '}
              <Text
                style={styles.linkText}
                onPress={() =>
                  Linking.openURL('https://vagustim.io/terms-of-use/')
                }>
                {getString('terms')}
              </Text>
              <Text style={styles.agreeText}> {getString('and')} </Text>
              <Text
                style={styles.linkText}
                onPress={() =>
                  Linking.openURL('https://vagustim.io/privacy-policy/')
                }>
                {getString('privacyPolicy')}
              </Text>
              {getString('agreeToVagustimTR')}
            </Text>
          </View>
          <CommonButton
            text={getString('signup')}
            onPress={registerHandler}
            buttonColor={COLORS.buttonGreen}
            buttonWidth={'90%'}
            buttonMarginTop={32}
          />
          <View style={styles.loginView}>
            <Text style={styles.alreadyText}>
              {getString('alreadyHaveAcc')}
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
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: '60%',
    height: undefined,
    aspectRatio: 1000 / 243,
    marginTop: 64,
    marginBottom: 36,
  },
  switchStyle: {
    transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }],
    marginRight: 12,
  },
  userSelectView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  termsView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  imageView: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputAndButtonView: {
    width: '80%',
    alignItems: 'center',
  },
  loginView: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  agreeText: {
    fontSize: 12,
    fontFamily: DEFAULT_FONT,
    color: COLORS.darkText,
  },
  linkText: {
    fontSize: 12,
    fontFamily: DEFAULT_FONT,
    color: COLORS.blueTextColor,
  },
  alreadyText: {
    fontSize: 16,
    fontFamily: DEFAULT_FONT,
    color: COLORS.darkText,
  },
  loginText: {
    fontSize: 16,
    fontFamily: DEFAULT_FONT,
    color: COLORS.blueTextColor,
  },
  expView: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#ccf5ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    borderRadius: 5
  },
  expText: {
    fontSize: 14,
    color: '#008fb3',
  },
  passwordView: {
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingBottom: 10,
  },
  inputStyle: {
    flex: 1,
    fontSize: 16,
    fontFamily: DEFAULT_FONT,
    height: 40,
    color: COLORS.darkerTextColor,
  },
  containerStyles1: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: COLORS.textInputBorderColor,
    marginTop: 24,
  },
  containerStyles2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: COLORS.textInputBorderColor,
    marginTop: 10,
  }
});

export default Register;
