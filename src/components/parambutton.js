import React from 'react';
import {Text, TextInput, View, TouchableOpacity} from 'react-native';

import {COLORS} from '../style/colors';

const ParamButton = ({
  paramValue,
  unitText,
  onPressMinus,
  onPressPlus,
  onChangeParamText,
}) => {
  const plusMinus = {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderColor: COLORS.vagustimBlue,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const plusMinusText = {
    fontSize: 28,
    alignSelf: 'center',
    marginBottom: 2,
    color: COLORS.vagustimBlue,
  };

  const inputViewStyle = {
    flex: 4,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.greyButtonColor,
    borderRadius: 8,
    height: 36,
    alignItems: 'center',
    padding: 4,
    marginHorizontal: 6,
  };

  const textInput = {
    flex: 1,
    height: 36,
    color: COLORS.darkText,
    marginTop: 4,
  };

  const textUnit = {
    fontSize: 12,
    color: COLORS.darkText,
    marginBottom: 2,
  };

  const rowView = {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  };

  return (
    <View style={rowView}>
      <TouchableOpacity
        style={plusMinus}
        onPress={onPressMinus}>
        <Text style={plusMinusText}> - </Text>
      </TouchableOpacity>
      <View style={inputViewStyle}>
        <TextInput
          style={textInput}
          keyboardType="numeric"
          onChangeText={onChangeParamText}
          value={paramValue}
        />
        <Text style={textUnit}>{unitText}</Text>
      </View>
      <TouchableOpacity
        style={plusMinus}
        onPress={onPressPlus}>
        <Text style={plusMinusText}> + </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ParamButton;
