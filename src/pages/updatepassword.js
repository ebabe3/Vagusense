import React, { useState } from 'react';
import { Text, Keyboard, StyleSheet, View, Alert } from 'react-native';

import { Container, Content } from 'native-base';

import CommonButton from '../components/commonbutton.js';
import CommonTextInput from '../components/commontextinput.js';
import CommonHeader from '../components/commonheader.js';

import { CONFIG } from '../data/config';
import { getString } from '../data/strings';
import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';


import TextBox from 'react-native-password-eye';

const UpdateAccount = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [requestActive, setRequestActive] = useState(false);
  const [passwordAlertType, setPasswordAlertType] = useState(null);
  const [confirmPasswordAlertType, setConfirmPasswordAlertType] = useState(null);
  const [textBoxPasswordHint, setTextBoxPasswordHint] = useState(' ');
  const [textBoxConfirmPasswordHint, setTextBoxConfirmPasswordHint] = useState(' ');

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

  const confirmHandler = () => {
    Keyboard.dismiss();
    if (requestActive) {
      return;
    }

    if (oldPassword !== CONFIG.userPass) {
      setOldPassword('');
      Alert.alert(getString('oldPasswordWrong'));
      return;
    }

    if (newPassword === newPassword2) {
      sendChangeRequest();
    } else {
      setNewPassword('');
      setNewPassword2('');
      Alert.alert(getString('passwordNoMatch'));
    }
  };

  const sendChangeRequest = () => {
    setRequestActive(true);
    fetch(CONFIG.baseServer + 'api/2.0/users/changePassword', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + CONFIG.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newPassword: newPassword,
        oldPassword: oldPassword,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setRequestActive(false);
        console.info(JSON.stringify(responseData, null, 2));
        if (responseData.message === 'Password Changed') {
          CONFIG.userPass = newPassword;
          navigation.navigate('Settings');
          Alert.alert(getString('updatedText'));
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
    <Container>
      <CommonHeader
        text={getString('updatePassword')}
        isBackActive={true}
        onPressBack={() => {
          navigation.navigate('Settings')
        }}
        isSettingsActive={false}
        isEditText={false}
      />
      <Content contentContainerStyle={styles.content}>
        <Text style={styles.titleText}>{getString('letsUpdatePass')}</Text>
        <CommonTextInput
          text={oldPassword}
          onChangeText={(text) => setOldPassword(text)}
          placeholderText={getString('oldPassword')}
          secureEntry={true}
          inputWidth={'100%'}
        />
        <TextBox
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => {
            setNewPassword(text);
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
            setNewPassword2(text);
            onChangeConfirmPassword(text);

          }}
          placeholderTextColor={COLORS.lightTextColor}
          alertType={confirmPasswordAlertType}
          iconSuccess={'check'}
          hint={textBoxConfirmPasswordHint}
          hintColor='#DD6B55'
          inputStyle={{ backgroundColor: 'red' }}
          containerStyles={[styles.containerStyles2]}
          inputStyle={[styles.inputStyle]}
        />
        <View style={styles.expView}>
          <Text style={styles.expText}>{getString('passwordExp')}</Text>
        </View>
        <CommonButton
          text={getString('confirm')}
          onPress={confirmHandler}
          buttonColor={COLORS.buttonBlue}
          buttonWidth={'90%'}
          buttonMarginTop={48}
        />
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
  loginText: {
    fontSize: 16,
    fontFamily: DEFAULT_FONT,
    color: COLORS.blueTextColor,
  },
  titleText: {
    fontFamily: DEFAULT_FONT,
    fontSize: 19,
    color: COLORS.darkerTextColor,
    marginBottom: 16,
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

export default UpdateAccount;
