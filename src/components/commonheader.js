import React from 'react';
import {Text} from 'react-native';
import {Left, Right, Button, Body, Title, Header, Icon} from 'native-base';

import {COLORS} from '../style/colors';
import {DEFAULT_FONT} from '../style/fonts';
import {getString} from '../data/strings';

const CommonHeader = ({
  text,
  isBackActive,
  onPressBack,
  onPressSettings,
  isSettingsActive = true,
  isEditText = false,
}) => {
  const headerBodyStyle = {
    flex: 2,
  };

  const iconViewStyle = {
    flex: 1,
  };

  const headerStyle = {
    backgroundColor: 'white',
  };

  const rightIconStyle = {
    color: COLORS.textInputBorderColor,
    padding: 4,
    marginTop: 4,
    fontSize: 24,
  };

  const leftIconStyle = {
    color: COLORS.blueTextColor,
    paddingVertical: 6,
    paddingRight: 6,
    marginTop: 8,
    fontSize: 24,
  };

  const titleStyle = {
    fontFamily: DEFAULT_FONT,
    color: COLORS.darkerTextColor,
    fontSize: 18,
    alignSelf: 'center',
  };

  const textStyle = {
    fontFamily: DEFAULT_FONT,
    color: COLORS.blueTextColor,
    fontSize: 16,
    alignSelf: 'center',
    padding: 8,
  };

  const showHamburgerButton = isSettingsActive && !isEditText;
  const showEditButton = isSettingsActive && isEditText;

  return (
    <Header androidStatusBarColor={COLORS.vagustimBlue} style={headerStyle}>
      <Left style={iconViewStyle}>
        {isBackActive && (
          <Button transparent>
            <Icon
              name="arrow-back"
              style={leftIconStyle}
              onPress={onPressBack}
            />
          </Button>
        )}
      </Left>
      <Body style={headerBodyStyle}>
        <Title style={titleStyle}>{text}</Title>
      </Body>
      <Right style={iconViewStyle}>
        {showEditButton && (
          <Text style={textStyle} onPress={onPressSettings}>
            {getString('edit')}
          </Text>
        )}
        {showHamburgerButton && (
          <Button transparent>
            <Icon
              name="menu"
              style={rightIconStyle}
              onPress={onPressSettings}
            />
          </Button>
        )}
      </Right>
    </Header>
  );
};

export default CommonHeader;
