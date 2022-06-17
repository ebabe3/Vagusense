import React, { useState, useEffect } from 'react';
import { View, Keyboard, StyleSheet, Text, Alert } from 'react-native';

import { Container, Content } from 'native-base';

import DropDownPicker from 'react-native-dropdown-picker';

import CommonButton from '../components/commonbutton.js';
import CommonTextInput from '../components/commontextinput.js';
import CommonHeader from '../components/commonheader.js';

import { CONFIG } from '../data/config';
import { getString } from '../data/strings';
import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';


const UpdateEndUser = ({ navigation, route }) => {
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [requestActive, setRequestActive] = useState(false);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(true);
    const [items, setItems] = useState([
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Intersex', value: 'Intersex' },
        { label: 'Prefer not to disclose', value: 'None' }
    ]);

    //Get endUser Subuser info
    useEffect(() => {
        if (route.params.isEdit) {
            getEndUserInfo();
        }
    }, []);

    const getEndUserInfo = () => {
        fetch(CONFIG.baseServer + 'api/2.0/subusers/' + CONFIG.patientId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + CONFIG.token,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.info(JSON.stringify(responseData, null, 2));
                setAge(String(responseData.age));
                setHeight(String(responseData.height));
                setValue(responseData.gender);
                setWeight(String(responseData.weight));
            })
            .catch((error) => {
                console.info(error);
            });
    };

    const handleBack = () => {
        if (route.params.isEdit) {
            navigation.navigate('Settings');
        } else {
            navigation.navigate('Login');
        }
    };

    const handleUpdate = () => {
        Keyboard.dismiss();
        if (requestActive) {
            return;
        }

        if (!age || !height || !weight) {
            Alert.alert(getString('pleaseFill'));
        } else {
            updateSubuser();
        }
    };

    const updateSubuser = () => {
        setRequestActive(true);
        fetch(CONFIG.baseServer + 'api/2.0/subusers/newEndUser/update', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + CONFIG.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                age: age,
                gender: value,
                height: height,
                patientId: CONFIG.patientId,
                name: CONFIG.name,
                surname: CONFIG.surname,
                weight: weight
            }),
        })
            .then((response) => response.json())
            .then((responseData) => {
                setRequestActive(false);
                console.info(JSON.stringify(responseData, null, 2));
                if (responseData.message === 'subuser updated succesfully') {
                    if (route.params.isEdit) {
                        navigation.navigate('Settings');
                    } else {
                        navigation.navigate('UserPage');
                    }
                } else {
                    Alert.alert(getString('unknownErrorOccured'));
                }
            })
            .catch((error) => {
                setRequestActive(false);
                Alert.alert(getString('checkNetwork'));
            });
    };

    return (
        <Container>
            <CommonHeader
                text={""}
                isBackActive={true}
                onPressBack={() => {
                    handleBack();
                }}
                isSettingsActive={false}
            />
            <Content contentContainerStyle={styles.content}>
                <Text style={styles.titleText}>{getString('letsUpdateAcc')}</Text>
                <View style={styles.doubleInputViewTop}>
                    <CommonTextInput
                        text={height}
                        onChangeText={(text) => setHeight(text)}
                        placeholderText={getString('height')}
                        inputWidth={'45%'}
                        keyboardType="numeric"
                    />
                    <CommonTextInput
                        text={weight}
                        onChangeText={(text) => setWeight(text)}
                        placeholderText={getString('weight')}
                        inputWidth={'45%'}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.doubleInputViewBottom}>
                    <CommonTextInput
                        text={age}
                        onChangeText={(text) => setAge(text)}
                        placeholderText={getString('age')}
                        inputWidth={'45%'}
                        keyboardType="numeric"
                    />
                    <View style={{ width: '10%' }}></View>
                    <DropDownPicker
                        style={styles.dropStyle}
                        dropDownContainerStyle={styles.dropContStyle}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder='Sex'
                    />
                </View>
                <View style={styles.buttonAndTextView}>
                    <CommonButton
                        text={getString('update')}
                        onPress={handleUpdate}
                        buttonColor={COLORS.buttonBlue}
                        buttonWidth={'90%'}
                        buttonMarginTop={48}
                    />
                </View>
            </Content>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '85%'
    },
    dropStyle: {
        width: '45%',
        marginTop: 12
    },
    dropContStyle: {
        width: '45%',
        marginTop: 12,
    },
    titleText: {
        fontFamily: DEFAULT_FONT,
        fontSize: 19,
        color: COLORS.darkerTextColor,
        marginBottom: 16,
    },
    doubleInputViewTop: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    doubleInputViewBottom: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '30%'
    },
    buttonAndTextView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '30%'
    },
});

export default UpdateEndUser;
