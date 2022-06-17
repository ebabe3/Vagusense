import React, { useState } from 'react';
import { StyleSheet, Linking } from 'react-native';

import {
  Container,
  Content,
  Separator,
  ListItem,
  Text,
  Icon,
  Left,
  Right,
} from 'native-base';

import AsyncStorage from '@react-native-async-storage/async-storage';

import CommonHeader from '../components/commonheader.js';

import { CONFIG } from '../data/config';
import { getString, setLanguage, getLanguage } from '../data/strings';
import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';

const Settings = ({ navigation }) => {
  const [lang, setLang] = useState(getLanguage());

  const chooseLang = (selectedLang) => {
    setLang(selectedLang);
    setLanguage(selectedLang);
    AsyncStorage.setItem(CONFIG.languageKey, selectedLang);
    navigation.navigate('Settings');
  };

  return (
    <Container>
      <CommonHeader
        text={getString('settings')}
        isBackActive={true}
        onPressBack={() => {
          if (CONFIG.userRole === "ROLE_USER") {
            navigation.navigate('UserPage');
          } else if (CONFIG.userRole.includes("ROLE_RESEARCHER")) {
            navigation.navigate('BleConnected');
          } else {
            navigation.navigate('ListUsers');
          }

        }}
        isSettingsActive={false}
        isEditText={false}
      />
      <Content>
        <Separator style={styles.sepStyle} bordered>
          <Text style={styles.separatorTextStyle}>{getString('account')}</Text>
        </Separator>
        <ListItem>
          <Left>
            <Text style={styles.itemTextStyle}>{CONFIG.userMail}</Text>
          </Left>
          <Right>
            <Text style={styles.editTextStyle} onPress={() => {
                navigation.navigate('UpdateAccount',{
                });
              }}>
              {getString('edit')}
            </Text>
          </Right>
        </ListItem>
        <ListItem
          onPress={() => {
            navigation.navigate('UpdatePassword');
          }}
          last>
          <Left>
            <Text style={styles.blueItemTextStyle}>
              {getString('changePassword')}
            </Text>
          </Left>
          <Right>
            <Icon style={styles.iconStyle} name="arrow-forward" />
          </Right>
        </ListItem>
        {CONFIG.userRole === "ROLE_USER" ? <ListItem
          onPress={() => {
            navigation.navigate('UpdateEndUser', {
              isEdit: true,
            });
          }}
          last>
          <Left>
            <Text style={styles.blueItemTextStyle}>
              {getString('updateInfo')}
            </Text>
          </Left>
          <Right>
            <Icon style={styles.iconStyle} name="arrow-forward" />
          </Right>
        </ListItem> : null}
        <Separator style={styles.sepStyle} bordered>
          <Text style={styles.separatorTextStyle}>{getString('language')}</Text>
        </Separator>
        <ListItem
          onPress={() => {
            chooseLang('en');
          }}>
          <Left>
            <Text style={styles.itemTextStyle}>{getString('english')}</Text>
          </Left>
          {lang === 'en' && (
            <Right>
              <Icon style={styles.iconStyle} name="checkmark-sharp" />
            </Right>
          )}
        </ListItem>
        <ListItem
          onPress={() => {
            chooseLang('tr');
          }}
          last>
          <Left>
            <Text style={styles.itemTextStyle}>{getString('turkish')}</Text>
          </Left>
          {lang === 'tr' && (
            <Right>
              <Icon style={styles.iconStyle} name="checkmark-sharp" />
            </Right>
          )}
        </ListItem>
        <Separator style={styles.sepStyle} bordered>
          <Text style={styles.separatorTextStyle}>{getString('support')}</Text>
        </Separator>
        <ListItem
          onPress={() => {
            Linking.openURL('https://vagustim.io/resources/');
          }}>
          <Text style={styles.blueItemTextStyle}>{getString('userMan')}</Text>
        </ListItem>
        <ListItem
          onPress={() => {
            Linking.openURL('https://vagustim.io/contact/');
          }}>
          <Text style={styles.blueItemTextStyle}>{getString('contactUs')}</Text>
        </ListItem>
        <ListItem
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <Text style={styles.redItemTextStyle}>{getString('logout')}</Text>
        </ListItem>
        <Separator style={styles.sepStyle} bordered>
          <Text style={styles.separatorTextStyle}>{getString('about')}</Text>
        </Separator>
        <ListItem>
          <Left>
            <Text style={styles.itemTextStyle}>{CONFIG.appVersion}</Text>
          </Left>
        </ListItem>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: COLORS.vagustimBlue,
  },
  sepStyle: {
    height: 48,
  },
  separatorTextStyle: {
    fontFamily: DEFAULT_FONT,
    fontSize: 16,
    color: COLORS.lightTextColor,
  },
  itemTextStyle: {
    fontFamily: DEFAULT_FONT,
    color: COLORS.darkerTextColor,
    fontSize: 16,
  },
  blueItemTextStyle: {
    fontFamily: DEFAULT_FONT,
    color: COLORS.blueTextColor,
    fontSize: 16,
  },
  redItemTextStyle: {
    fontFamily: DEFAULT_FONT,
    color: COLORS.redTextColor,
    fontSize: 16,
  },
  iconStyle: {
    color: COLORS.blueTextColor,
  },
  editTextStyle: {
    fontFamily: DEFAULT_FONT,
    color: COLORS.blueTextColor,
    fontSize: 15,
    paddingVertical: 8,
  },
});

export default Settings;
