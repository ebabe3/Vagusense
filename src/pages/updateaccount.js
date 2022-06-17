import React, { useState } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';

import { Container, Content } from 'native-base';

import CommonButton from '../components/commonbutton.js';
import CommonTextInput from '../components/commontextinput.js';
import CommonHeader from '../components/commonheader.js';

import { CONFIG } from '../data/config';
import { getString } from '../data/strings';
import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';


const UpdateAccount = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [requestActive, setRequestActive] = useState(false);


  const confirmHandler = () => {
    sendRegisterRequest();
  };

  const sendRegisterRequest = () => {
    setRequestActive(true);
    fetch(CONFIG.baseServer + 'api/2.0/users/update', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + CONFIG.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        name: name,
        surname: lastname,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setRequestActive(false);
        console.info(JSON.stringify(responseData, null, 2));
        if (responseData.message === 'User updated successfully') {
          CONFIG.userMail = email;
          CONFIG.nameOfUser = name;
          CONFIG.surnameOfUser = lastname;
          navigation.navigate('Login');
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
        text={getString('updateAccount')}
        isBackActive={true}
        onPressBack={() => {
          navigation.navigate('Settings');
        }}
        isSettingsActive={false}
        isEditText={false}
      />
      <Content contentContainerStyle={styles.content}>
        <Text style={styles.titleText}>{getString('letsUpdateAcc')}</Text>
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
});

export default UpdateAccount;
