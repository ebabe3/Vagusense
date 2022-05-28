import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';

import {COLORS} from '../style/colors';
import {DEFAULT_FONT} from '../style/fonts';
import {getString} from '../data/strings';

const HeadphoneSelect = ({isLeftSelected, onPressLeft, onPressRight}) => {
  const headphoneSelectLeftView = {
    width: '50%',
    borderColor: COLORS.lightGrey,
    borderTopWidth: 1,
    borderRightWidth: 0.8,
    borderTopRightRadius: 16,
  };

  const headphoneSelectRightView = {
    width: '50%',
    borderColor: COLORS.lightGrey,
    borderTopWidth: 1,
    borderLeftWidth: 0.8,
    borderTopLeftRadius: 16,
  };

  const touchableStyle = {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const headphoneSelectActive = {
    backgroundColor: 'white',
  };

  const headphoneSelectPassive = {
    backgroundColor: COLORS.controlBackgroundColor,
    borderBottomWidth: 1,
  };

  const headphoneLetterText = {
    fontSize: 20,
    marginLeft: 4,
    fontFamily: DEFAULT_FONT,
    color: COLORS.headphoneTextColor,
  };

  const headphoneIconStyle = {
    color: COLORS.headphoneTextColor,
    fontSize: 22,
    marginTop: 4,
  };

  return (
    <>
      <View
        style={[
          headphoneSelectLeftView,
          isLeftSelected ? headphoneSelectActive : headphoneSelectPassive,
        ]}>
        <TouchableOpacity style={touchableStyle} onPress={onPressLeft}>
          <Icon
            type="MaterialCommunityIcons"
            style={headphoneIconStyle}
            name={'headphones'}
          />
          <Text style={headphoneLetterText}>{getString('L')}</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          headphoneSelectRightView,
          isLeftSelected ? headphoneSelectPassive : headphoneSelectActive,
        ]}>
        <TouchableOpacity style={touchableStyle} onPress={onPressRight}>
          <Icon
            type="MaterialCommunityIcons"
            style={headphoneIconStyle}
            name={'headphones'}
          />
          <Text style={headphoneLetterText}>{getString('R')}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default HeadphoneSelect;
