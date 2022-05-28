import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {Icon} from 'native-base';

import ProgressBar from 'react-native-progress/Bar';

import {COLORS} from '../style/colors';
import {DEFAULT_FONT} from '../style/fonts';
import {getString} from '../data/strings';

const HeadphoneControl = ({
  isStimStarted,
  onPressedMinus,
  onPressedPlus,
  currentProgress,
  isLeft,
  isLeftConnected,
  isRightConnected,
  isOffTime,
}) => {
  const buttonWidth = 148;
  const buttonHeight = 48;
  const defaultBorderRadius = 24;

  const wrapper = {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const electrodeTextView = {
    flex: 7,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const progressView = {
    flex: 3,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const buttonAndTextView = {
    flex: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  };

  const buttonView = {
    width: buttonWidth,
    height: buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.intensityControlBackgroundColor,
    borderRadius: defaultBorderRadius,
    borderWidth: 2,
    borderColor: COLORS.intensityControlBorderColor,
  };

  const minusPlusButtonView = {
    width: buttonWidth / 2,
    height: buttonHeight,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const leftTouchableStyle = {
    borderTopLeftRadius: defaultBorderRadius,
    borderBottomLeftRadius: defaultBorderRadius,
  };

  const rightTouchableStyle = {
    borderTopRightRadius: defaultBorderRadius,
    borderBottomRightRadius: defaultBorderRadius,
  };

  const headphoneTextStyle = {
    fontFamily: DEFAULT_FONT,
    fontSize: 20,
    color: COLORS.darkerTextColor,
  };

  const intensityText = {
    fontFamily: DEFAULT_FONT,
    fontSize: 15,
    color: COLORS.darkerTextColor,
    marginTop: 10,
    marginBottom: 8,
  };

  const offPeriodText = {
    fontFamily: DEFAULT_FONT,
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: 2,
    color: COLORS.darkerTextColor,
  };

  const headphoneIconStyle = {
    color: COLORS.headphoneTextColor,
    fontSize: 28,
  };

  const plusMinusIconStyle = {
    color: COLORS.darkerTextColor,
    fontSize: 30,
  };

  var headphoneIconName = '';

  if (isLeft) {
    if (isLeftConnected) {
      headphoneIconName = 'headphones';
    } else {
      headphoneIconName = 'headphones-off';
    }
  } else {
    if (isRightConnected) {
      headphoneIconName = 'headphones';
    } else {
      headphoneIconName = 'headphones-off';
    }
  }

  return (
    <View style={wrapper}>
      <View style={electrodeTextView}>
        {isOffTime? (
          <Text style={offPeriodText}>
            {getString('offTime')}
          </Text> 
        ) : (       
          <Icon
            type="MaterialCommunityIcons"
            style={headphoneIconStyle}
            name={headphoneIconName}
          />
        )}
        <Text style={headphoneTextStyle}>
          {isLeft ? getString('leftElectrode') : getString('rightElectrode')}
        </Text>
      </View>
      <View style={progressView}>
        <ProgressBar
          progress={currentProgress / 100}
          height={7}
          width={255}
          color={COLORS.progressColor}
          borderColor={COLORS.textInputBorderColor}
        />
      </View>
      <View style={buttonAndTextView}>
        <Text style={intensityText}>{getString('intensity')}</Text>
        <View style={buttonView}>
          <TouchableHighlight
            disabled={!isStimStarted || isOffTime}
            style={leftTouchableStyle}
            onPress={onPressedMinus}
            underlayColor={COLORS.intensityControlBorderColor}>
            <View style={minusPlusButtonView}>
              <Icon
                type="MaterialCommunityIcons"
                style={plusMinusIconStyle}
                name={'minus'}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            disabled={!isStimStarted || isOffTime}
            style={rightTouchableStyle}
            onPress={onPressedPlus}
            underlayColor={COLORS.intensityControlBorderColor}>
            <View style={minusPlusButtonView}>
              <Icon
                type="MaterialCommunityIcons"
                style={plusMinusIconStyle}
                name={'plus'}
              />
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
};

export default HeadphoneControl;
