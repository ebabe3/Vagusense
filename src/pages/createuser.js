import React, { useState, useEffect } from 'react';
import { View, Keyboard, StyleSheet, Text, Alert } from 'react-native';

import { Container, Content } from 'native-base';
import CommonButton from '../components/commonbutton.js';
import CommonTextInput from '../components/commontextinput.js';
import CommonHeader from '../components/commonheader.js';

import { CONFIG } from '../data/config';
import { getString } from '../data/strings';
import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';


const CreateUser = ({ navigation, route }) => {
  const [humanId, setHumanId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [requestActive, setRequestActive] = useState(false);

  const [gender, setGender] = useState('');

  //Get user info
  useEffect(() => {
    if (route.params.isEdit) {
      getUserInfo();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getUserInfo = () => {
    fetch(CONFIG.baseServer + 'api/patients/' + CONFIG.patientId, {
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
        setHumanId(responseData.Items[0].humanId);
        setPatientId(responseData.Items[0].patientId);
        setName(responseData.Items[0].name);
        setLastName(responseData.Items[0].surname);
        setAge(String(responseData.Items[0].age));
        setHeight(String(responseData.Items[0].height));
        setGender(responseData.Items[0].gender)
        setWeight(String(responseData.Items[0].weight));
      })
      .catch((error) => {
        console.info(error);
      });
  };

  const handleBack = () => {
    if (route.params.isEdit) {
      navigation.navigate('ListUsers');
    } else {
      if (CONFIG.userRole === "ROLE_USER") {
        navigation.navigate('Login');
      } else {
        navigation.navigate('ListUsers');
      }

    }
  };

  const handleDeleteUser = () => {
    if (requestActive) {
      return;
    }
    setRequestActive(true);
    fetch(CONFIG.baseServer + 'api/patients/' + CONFIG.patientId, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + CONFIG.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setRequestActive(false);
        console.info(JSON.stringify(responseData, null, 2));
        if (responseData.message === 'Patient Deleted Successfully') {
          navigation.navigate('ListUsers');
          Alert.alert(getString('userDeleted'));
        } else {
          Alert.alert(getString('unknownErrorOccured'));
        }
      })
      .catch((error) => {
        console.info(error);
        setRequestActive(false);
        Alert.alert(getString('checkNetwork'));
      });
  };

  const handleCreate = () => {
    Keyboard.dismiss();
    if (requestActive) {
      return;
    }

    if (!name || !lastName || !age || !height || !weight || !humanId) {
      Alert.alert(getString('pleaseFill'));
    } else {
      if (route.params.isEdit) {
        editUser();
      } else {
        createUser();
      }
    }
  };

  const createUser = () => {
    setRequestActive(true);
    fetch(CONFIG.baseServer + 'api/patients/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + CONFIG.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        age: age,
        surname: lastName,
        height: height,
        gender: gender,
        weight: weight,
        humanId: humanId
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setRequestActive(false);
        console.info(JSON.stringify(responseData, null, 2));
        if (responseData.message === 'Patient Added Successfully') {
          console.info("CONFIG.userRole" + CONFIG.userRole);
          if (CONFIG.userRole === 'ROLE_USER') {
            navigation.navigate('Login');
          } else {
            navigation.navigate('ListUsers');
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

  const editUser = () => {
    setRequestActive(true);
    fetch(CONFIG.baseServer + 'api/patients/', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + CONFIG.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        age: age,
        surname: lastName,
        height: height,
        gender: gender,
        weight: weight,
        patientId: patientId,
        humanId: humanId
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setRequestActive(false);
        console.info(JSON.stringify(responseData, null, 2));
        if (responseData.message === 'Patient Updated Successfully') {
          navigation.navigate('ListUsers');
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
        text={
          route.params.isEdit ? getString('editUser') : getString('createUser')
        }
        isBackActive={true}
        onPressBack={() => {
          handleBack();
        }}
        isSettingsActive={false}
      />
      <Content contentContainerStyle={styles.content}>
        <CommonTextInput
          text={humanId}
          onChangeText={(text) => setHumanId(text)}
          placeholderText={"TC Kimlik No"}
          inputWidth={'100%'}
          keyboardType="numeric"
        />
        <CommonTextInput
          text={name}
          onChangeText={(text) => setName(text)}
          placeholderText={getString('name')}
          inputWidth={'100%'}
        />
        <CommonTextInput
          text={lastName}
          onChangeText={(text) => setLastName(text)}
          placeholderText={getString('lastname')}
          inputWidth={'100%'}
        />
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
          <CommonTextInput
            text={gender}
            onChangeText={(text) => setGender(text)}
            placeholderText={getString('gender')}
            inputWidth={'100%'}
          />
        </View>
        <View style={styles.buttonAndTextView}>
          <CommonButton
            text={route.params.isEdit ? getString('edit') : getString('create')}
            onPress={handleCreate}
            buttonColor={COLORS.buttonBlue}
            buttonWidth={'80%'}
            buttonMarginTop={16}
            buttonMarginBottom={28}
          />
          {route.params.isEdit && (
            <Text
              style={styles.deleteText}
              onPress={() => {
                handleDeleteUser();
              }}>
              {getString('deleteUser')}
            </Text>
          )}
        </View>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '85%'
  },
  loginText: {
    fontSize: 16,
    fontFamily: DEFAULT_FONT,
    color: COLORS.blueTextColor,
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
    paddingBottom: '10%'
  },
  buttonAndTextView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontFamily: DEFAULT_FONT,
    fontSize: 16,
    marginBottom: 16,
    padding: 8,
    color: COLORS.redTextColor,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 16,
    fontFamily: DEFAULT_FONT,
    height: 40,
    color: COLORS.darkerTextColor,
    textAlignVertical: 'top',
  },
});

export default CreateUser;
