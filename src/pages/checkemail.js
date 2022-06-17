import React from 'react';
import {Text, StatusBar, StyleSheet} from 'react-native';

import {Container, Content} from 'native-base';

import CommonButton from '../components/commonbutton.js';

import {COLORS} from '../style/colors';
import {DEFAULT_FONT} from '../style/fonts';
import {getString} from '../data/strings';

const CheckEmail = ({navigation, route}) => {
  const loginHandler = () => {
    navigation.navigate('Login');
  };

  return (
    <Container>
      <StatusBar backgroundColor={COLORS.vagustimBlue} />
      <Content contentContainerStyle={styles.content}>
        <Text style={styles.checkEmailText}>{getString('checkYourEmail')}</Text>
        <Text style={styles.checkExpText}>
          {route.params.isReset
            ? getString('emailExpReset')
            : getString('emailExpConfirm')}
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
};

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

export default CheckEmail;
