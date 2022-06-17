import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { DEFAULT_FONT } from '../style/fonts';
import { COLORS } from '../style/colors';

const SurveyButton = ({
  text,
  onPress,
  buttonMarginTop = 16,
  buttonMarginBottom = 0,
  buttonWidth = 175,
  buttonHeight = 50,
  buttonRadius = 24,
  surveyStyle,
  backgroundColor = 'white'
}) => {
  const wrapperStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: buttonMarginTop,
    marginBottom: buttonMarginBottom,
    height: buttonHeight,
    width: buttonWidth,
  };

  const containerCommonStyle = {
    backgroundColor: backgroundColor,
    paddingVertical: 8,
    width: '100%',
    height: buttonHeight,
    borderRadius: buttonRadius,
    borderWidth: 1,
    borderColor: COLORS.textInputBorderColor,
    justifyContent: 'center',
  };

  const textCommonStyle = {
    color: COLORS.darkerTextColor,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
  };


  return (
    <TouchableOpacity
      style={wrapperStyle}
      onPress={onPress}
      activeOpacity={0.5}>
      <View style={[surveyStyle, containerCommonStyle]}>
        <Text style={textCommonStyle}> {text} </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SurveyButton;
