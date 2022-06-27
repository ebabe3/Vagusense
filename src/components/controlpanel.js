import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'native-base';

import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';
import { getString } from '../data/strings';

const ControlPanel = ({
  isStimStarted,
  isStimPaused,
  onPressStart,
  onPressStop,
  leftCurrent,
  rightCurrent,
}) => {
  const circleDiameter = 80;

  const wrapper = {
    flex: 1,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const buttonAndTextView = {
    flex: 3,
    flexDirection: 'row',
  };

  const leftRightView = {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const textView = {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const circleView = {
    width: circleDiameter,
    height: circleDiameter,
    borderRadius: circleDiameter / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  };

  const greenBack = {
    backgroundColor: COLORS.startButtonColor,
  };

  const yellowBack = {
    backgroundColor: COLORS.pauseButtonColor,
  };

  const redBack = {
    backgroundColor: COLORS.stopButtonColor,
  };

  const greyBack = {
    backgroundColor: COLORS.greyButtonColor,
  };

  const controlText = {
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
    fontSize: 18,
    color: COLORS.darkerTextColor,
    marginBottom: 8,
  };

  const greyText = {
    color: COLORS.lightTextColor,
  };

  const currentText = {
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
    fontSize: 15,
    marginTop: 4,
    color: COLORS.darkerTextColor,
  };

  const iconStyle = {
    color: 'white',
    fontSize: 36,
    marginLeft: 2,
  };

  const touchableStyle = {
    width: circleDiameter,
    height: circleDiameter,
    borderRadius: circleDiameter / 2,
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <View style={wrapper}>
      <View style={buttonAndTextView}>
        <View style={leftRightView}>
          <Text style={[controlText, !isStimStarted ? greyText : null]}>
            {isStimPaused
              ? getString('controlStop')
              : getString('controlPause')}
          </Text>
          <View
            style={[
              circleView,
              isStimPaused ? redBack : isStimStarted ? yellowBack : greyBack,
            ]}>
            <TouchableOpacity style={touchableStyle} onPress={onPressStop}>
              <Icon name={isStimPaused ? 'stop' : 'pause'} style={iconStyle} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={leftRightView}>
          <Text
            style={[
              controlText,
              isStimStarted && !isStimPaused ? greyText : null,
            ]}>
            {isStimPaused
              ? getString('controlContinue')
              : getString('controlStart')}
          </Text>
          <View
            style={[
              circleView,
              isStimStarted && !isStimPaused ? greyBack : greenBack,
            ]}>
            <TouchableOpacity style={touchableStyle} onPress={onPressStart}>
              <Icon name="play" style={iconStyle} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {(
        <View style={textView}>
          {(
            <Text style={currentText}>
              {'PPG : '}{leftCurrent}{'  '}
              {'Skin Response : '}{rightCurrent}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default ControlPanel;
