import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CommonButton from '../../components/commonbutton.js';
import { Container } from 'native-base';
import { COLORS } from '../../style/colors';
import { DEFAULT_FONT } from '../../style/fonts';

const SelectMeasurement = ({ navigation, route }) => {


    return (
        <Container>
            <View
                style={{
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <CommonButton
                    text={"Normal Measurement"}
                    onPress={() => {
                        navigation.navigate('NormalMeasurement', {
                            selectedDeviceName: route.params.selectedDeviceName
                        });
                    }}
                    buttonColor={COLORS.buttonBlue}
                    buttonWidth={'50%'}
                    buttonMarginTop={54}
                />

                <CommonButton
                    text={"Only GSR"}
                    onPress={() => {
                        navigation.navigate('OnlyGSR', {
                            selectedDeviceName: route.params.selectedDeviceName
                        });
                    }}
                    buttonColor={COLORS.buttonBlue}
                    buttonWidth={'50%'}
                    buttonMarginTop={54}
                />

                <CommonButton
                    text={"Live Measurement"}
                    onPress={() => {
                        navigation.navigate('LiveMeasurement', {
                            selectedDeviceName: route.params.selectedDeviceName
                        });
                    }}
                    buttonColor={COLORS.buttonBlue}
                    buttonWidth={'50%'}
                    buttonMarginTop={54}
                />
            </View >
        </Container >
    )
}

const styles = StyleSheet.create({
    content: {},
    headerBodyStyle: {
        flex: 3,
    },
    iconViewStyle: {
        flex: 1,

    },
    headerStyle: {
        backgroundColor: 'white',
    },
    iconStyle: {
        marginLeft: 8,
        fontSize: 22,
        color: COLORS.textInputBorderColor,
    },
    titleStyle: {
        fontFamily: DEFAULT_FONT,
        color: COLORS.darkerTextColor,
        fontSize: 20,
        alignSelf: 'center'
    },
    searchbarBackStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.lightGrey,
        height: 54,
    },
    searchInnerViewStyle: {
        width: '96%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        height: 42,
    },
    textInputStyle: {
        flex: 1,
        marginLeft: 4,
    },
    itemTextStyle: {
        fontFamily: DEFAULT_FONT,
        color: COLORS.darkerTextColor,
        fontSize: 16,
    },
    textAndButtonView: {
        height: '25%',
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    startStimText: {
        width: '70%',
        textAlign: 'center',
        fontFamily: DEFAULT_FONT,
        color: COLORS.darkerTextColor,
        fontSize: 19,
    },
    separatorStyle: {
        fontSize: 13,
    },
    editTextStyle: {
        fontFamily: DEFAULT_FONT,
        color: COLORS.blueTextColor,
        fontSize: 16,
        position: 'relative',

    }
});

export default SelectMeasurement;