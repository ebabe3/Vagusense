import React from 'react';
import { Text, SectionList, View, StyleSheet } from 'react-native';

import { Container, ListItem, Left } from 'native-base';

import CommonHeader from '../components/commonheader.js';
import CommonButton from '../components/commonbutton.js';

import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';
import { CONFIG } from '../data/config';

const ListDevices = ({ navigation, route }) => {

    const Item = ({ name }) => (
        <ListItem
            onPress={() => {
                navigation.navigate('BleConnectSelectedDevice', {
                    selectedDeviceName: name
                });
            }}>
            <Left>
                <Text style={styles.itemTextStyle}>{name}</Text>
            </Left>
        </ListItem>
    );

    return (
        <Container>
            <CommonHeader
                text={"List of Devices"}
                isBackActive={false}
                isSettingsActive={false}
                isEditText={false}
            />
            <SectionList
                sections={CONFIG.deviceList}
                keyExtractor={(item, index) => item + index}
                tintColor="#F8852D"
                onEndReachedThreshold={0.5}
                renderItem={({ item }) =>
                    <View>
                        <Item name={item.name} />
                    </View>
                }
            />
            <View style={styles.textAndButtonView}>
                <Text style={styles.startStimText}>{"To connect a device, please tap on the device"}</Text>
                <CommonButton
                    text={"Search Again"}
                    onPress={() => {
                        navigation.navigate('BleSearchDevices');
                    }}
                    buttonColor={COLORS.buttonBlue}
                    buttonWidth={'80%'}
                    buttonMarginTop={16}
                    buttonMarginBottom={28}
                />
            </View>
        </Container>
    );
};

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

export default ListDevices;
