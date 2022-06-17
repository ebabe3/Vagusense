import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { Container, Content } from 'native-base';

import CommonButton from '../components/commonbutton.js';
import CommonHeader from '../components/commonheader.js';

import { okSignData } from '../data/imagedata';

import { getString } from '../data/strings';
import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';
import { CONFIG } from '../data/config';

const StimEnd = ({ navigation }) => {
  return (
    <Container>
      <CommonHeader
        text={getString('stimFinished')}
        isBackActive={false}
        isSettingsActive={false}
        isEditText={false}
      />
      <View style={styles.content}>
        <View style={styles.imageView}>
          <Image
            style={[
              styles.imageStyle,
              {
                aspectRatio: okSignData.width / okSignData.height,
              },
            ]}
            source={okSignData.src}
          />
          <Text style={styles.stimFinText}>{getString('stimComplete')}</Text>
        </View>
        <View style={styles.buttonView}>
          <CommonButton
            text={CONFIG.userRole.includes("ROLE_RESEARCHER") ? getString('okay') : getString('takeSurvey')}
            onPress={() => {
              CONFIG.surveyDone = true;
              if (CONFIG.userRole.includes("ROLE_RESEARCHER")) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'BleSearch' }],
                });
              } else {
                navigation.navigate('Survey');
              }
            }}
            buttonColor={COLORS.buttonGreen}
            buttonWidth={'80%'}
            buttonMarginTop={0}
            buttonMarginBottom={12}
          />
          {CONFIG.userRole === 'ROLE_ADMIN' ? <CommonButton
            text={getString('okay')}
            onPress={() => {
              navigation.navigate('ListUsers');
            }}
            buttonColor={COLORS.buttonBlue}
            buttonWidth={'80%'}
            buttonMarginTop={0}
            buttonMarginBottom={12}
          /> : null}

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
    width: '100%',
  },
  titleText: {
    width: '80%',
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
    fontSize: 18,
    color: COLORS.darkerTextColor,
    marginBottom: 16,
  },
  stimFinText: {
    width: '80%',
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
    fontSize: 18,
    color: COLORS.darkerTextColor,
    marginVertical: 16,
  },
  imageView: {
    flex: 3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonView: {
    flex: 2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: '50%',
    height: undefined,
  },
});

export default StimEnd;
