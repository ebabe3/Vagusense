import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

import CommonButton from '../components/commonbutton.js';
import CommonHeader from '../components/commonheader.js';

import {Container} from 'native-base';

import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';
import { CONFIG } from '../data/config';

import 'moment/locale/tr'
import CommonTextInput from '../components/commontextinput.js';



const stimulationDetails = ({ navigation }) => {

    const [oldNotes, setOldNotes] = useState("");
    const [notes, setNotes] = useState("");


    useEffect(() => {
        getStimulationByStimulationId();
    }, []);

    const getStimulationByStimulationId = () => {
        fetch(CONFIG.baseServer + `api/stimulations/${CONFIG.stimulationId}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + CONFIG.token,
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((responseData) => {
                //console.info(JSON.stringify(responseData, null, 2));
                if (responseData.Items.length > 0) {
                    console.info(responseData.Items[0].notes);
                    setOldNotes(responseData.Items[0].notes);
                } else {
                    console.info('Data not found');
                }
            })
            .catch((error) => {
                console.info('Check internet connection');
            });

    };

    const updateNotes = () => {
        fetch(CONFIG.baseServer + 'api/stimulations/', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + CONFIG.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                stimulationId: CONFIG.stimulationId,
                notes: notes
            }),
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.info(JSON.stringify(responseData, null, 2));
                if (responseData.message === 'Stimulation Updated Successfuly') {
                    Alert.alert("Note Kaydedildi");
                    setOldNotes(notes);
                }
            })
            .catch((error) => {
                console.info('Check internet connection');
            });
    };

    return (
        <Container>
            <CommonHeader
                text={"Detay"}
                isBackActive={true}
                isSettingsActive={false}
                onPressBack={() => {
                    navigation.goBack();
                }}
                isEditText={false}
            />
            <View
                style={{
                    display: 'flex',
                    marginTop: '3%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text>{oldNotes}</Text>

                <CommonTextInput
                    text={notes}
                    onChangeText={(text) => {
                        setNotes(text);
                    }}
                    placeholderText={"Notlar"}
                    inputWidth={'70%'}
                />

                <CommonButton
                    text={"Not Ekle"}
                    onPress={() => {
                        updateNotes();
                    }}
                    buttonColor={COLORS.buttonBlue}
                    buttonWidth={'50%'}
                    buttonMarginTop={54}
                />

                <CommonButton
                    text={"Uyarım Sonrası Ölçüm Al"}
                    onPress={() => {
                        CONFIG.isBefore = false;
                        navigation.navigate('BleSearchDevices');
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

export default stimulationDetails;