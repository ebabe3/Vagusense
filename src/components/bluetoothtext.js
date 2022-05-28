import React from 'react';
import {View, Text} from 'react-native';

import {Icon} from 'native-base';

import {COLORS} from '../style/colors';
import {DEFAULT_FONT} from '../style/fonts';
import {getString} from '../data/strings';

const BluetoothText = ({isStimStarted, textIndex}) => {
  const dotDiameter = 10;

  const wrapper = {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const dotsView = {
    flexDirection: 'row',
    width: '40%',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const activeDot = {
    height: dotDiameter,
    width: dotDiameter,
    borderRadius: dotDiameter / 2,
    backgroundColor: COLORS.activeDotColor,
  };

  const passiveDot = {
    height: dotDiameter,
    width: dotDiameter,
    borderRadius: dotDiameter / 2,
    backgroundColor: COLORS.passiveDotColor,
  };

  const textStyle = {
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
    fontSize: 18,
    color: COLORS.textInputBorderColor,
    marginBottom: 24,
  };

  const pauseTextStyle = {
    fontFamily: DEFAULT_FONT,
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.pauseButtonColor,
  };

  const stopTextStyle = {
    fontFamily: DEFAULT_FONT,
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.stopButtonColor,
  };

  const headphoneIconStyle = {
    color: COLORS.headphoneTextColor,
    fontSize: 20,
  };

  const getText = () => {
    if (!isStimStarted) {
      return <Text style={textStyle}>{getString('pressPlay')}</Text>;
    } else {
      if (textIndex === 0) {
        return (
          <Text style={textStyle}>
            {getString('ifHeadphone')}
            <Icon
              type="MaterialCommunityIcons"
              style={headphoneIconStyle}
              name={'headphones-off'}
            />
            <Text style={textStyle}>{getString('checkHeadphone')}</Text>
          </Text>
        );
      } else if (textIndex === 1) {
        return (
          <Text style={textStyle}>
            {getString('bleTextPress')}
            <Text style={pauseTextStyle}>{getString('bleTextPause')}</Text>
            <Text style={textStyle}>{getString('bleTextAndThen')}</Text>
            <Text style={stopTextStyle}>{getString('bleTextStop')}</Text>
            <Text style={textStyle}>{getString('bleTextToFinish')}</Text>
          </Text>
        );
      } else if (textIndex === 2) {
        return <Text style={textStyle}>{getString('bleTextYouCan')}</Text>;
      }
    }
  };

  return (
    <View style={wrapper}>
      {getText()}
      <View style={dotsView}>
        {!isStimStarted && <View style={activeDot}/>}
        <View
          style={isStimStarted && textIndex === 0 ? activeDot : passiveDot}
        />
        <View
          style={isStimStarted && textIndex === 1 ? activeDot : passiveDot}
        />
        <View
          style={isStimStarted && textIndex === 2 ? activeDot : passiveDot}
        />
      </View>
    </View>
  );
};

export default BluetoothText;
