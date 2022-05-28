import React from 'react';
import {Text, TextInput, View} from 'react-native';

import {DEFAULT_FONT} from '../style/fonts';
import {COLORS} from '../style/colors';
import {getString} from '../data/strings';

const CommonTextInput = ({
  text,
  onChangeText,
  placeholderText,
  secureEntry = false,
  forgotPassword = false,
  onPressForgot = null,
  inputWidth,
  inputHeight = 40,
  keyboardType = 'default',
}) => {
  const containerCommonStyle = {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: inputWidth,
    height: inputHeight,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: COLORS.textInputBorderColor,
    marginTop: 24,
  };

  const textInputStyle = {
    flex: 1,
    fontSize: 16,
    fontFamily: DEFAULT_FONT,
    height: 40,
    color: COLORS.darkerTextColor,
  };

  const forgotTextStyle = {
    fontFamily: DEFAULT_FONT,
    fontSize: 14,
    color: COLORS.blueTextColor,
    alignSelf: 'center',
  };

  return (
    <View style={containerCommonStyle}>
      <TextInput
        style={textInputStyle}
        underlineColorAndroid={'transparent'}
        autoCorrect={false}
        keyboardType={keyboardType}
        secureTextEntry={secureEntry}
        onChangeText={onChangeText}
        placeholder={placeholderText}
        placeholderTextColor={COLORS.lightTextColor}
        value={text}
      />
      {forgotPassword && (
        <Text style={forgotTextStyle} onPress={onPressForgot}>
          {getString('forgotPassword')}
        </Text>
      )}
    </View>
  );
};

export default CommonTextInput;
