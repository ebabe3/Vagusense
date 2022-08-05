import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, } from 'react-native';

import MyBleManager from '../components/ble.js';

import CommonButton from '../components/commonbutton.js';
import CommonHeader from '../components/commonheader.js';

import { Content, Container, Separator, ListItem, Left } from 'native-base';

import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';
import { CONFIG } from '../data/config';
import moment from 'moment';
import 'moment/locale/tr'

const UserPage = ({ navigation }) => {

  const bleInstance = MyBleManager.instance;

  const [originalAllUsers, setOriginalAllUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [formattedUsers, setFormattedUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  //Get stimulation ID
  useEffect(() => {
    getStimulationsByPatientId();
  }, []);

  const getStimulationsByPatientId = () => {
    fetch(CONFIG.baseServer + `api/stimulations/getStimulationsByPatientId/${CONFIG.patientId}`, {
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
          //console.info('Data found');
          setOriginalAllUsers(responseData.Items.filter(Items => Items.isActive == true));
          setAllUsers(responseData.Items.filter(Items => Items.isActive == true));

        } else {
          console.info('Data not found');
        }
      })
      .catch((error) => {
        console.info('Check internet connection');
      });

  };

  const handleBleSearch = () => {
    if (bleInstance.isConnected) {
      navigation.navigate('BleConnected');
    } else {
      startStimulation();
      navigation.navigate('BleSearch');
    }
  }

  const startStimulation = () => {
    fetch(CONFIG.baseServer + 'api/stimulations/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + CONFIG.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId: CONFIG.embeddedMAC,
        patientId: CONFIG.patientId
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.info(JSON.stringify(responseData, null, 2));
        if (responseData.message === 'Stimulation Can Start') {
          CONFIG.stimulationId = responseData.stimulationId;
        } else {
          console.info('Could not start stimulation');
        }
      })
      .catch((error) => {
        console.info('Check internet connection');
      });
  };

  //Process user info
  useEffect(() => {
    setFormattedUsers(formatUserData(allUsers));
  }, [allUsers]); // eslint-disable-line react-hooks/exhaustive-deps

  //Get user info
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getStimulationsByPatientId();
    });
    return unsubscribe;
  }, [navigation]);

  const formatUserData = (array) => {
    let formattedData = [];

    for (var i = 0; i < array.length; i++) {
      var user = array[i];
      var userData = {
        name: moment(user.timestamp).locale('tr').format('LLL'),
        id: user.stimulationId,
      };

      if (formattedData.length === 0) {
        formattedData[0] = { title: userData.name.split(' ')[1], data: [userData] };
      } else if (
        formattedData[formattedData.length - 1].title === userData.name.split(' ')[1]
      ) {
        formattedData[formattedData.length - 1].data.push(userData);
      } else {
        formattedData.push({ title: userData.name.split(' ')[1], data: [userData] });
      }
    }
    return formattedData;
  };

  const Item = ({ title, id }) => (
    <ListItem
      onPress={() => {
        if (title !== CONFIG.selectedSubuserNameSurname) {
          CONFIG.selectedSubuserNameSurname = title;
          CONFIG.patientId = id;
          CONFIG.surveyDone = false;
        }

        CONFIG.stimStartRequestSent = false;
        CONFIG.stimulationId = id;
        navigation.navigate('StimulationDetails', {
          isEdit: false,
        });
      }}>
      <Left>
        <Text style={styles.itemTextStyle}>{title}</Text>
      </Left>
    </ListItem>
  );


  const SeparatorHeader = ({ title }) => (
    <Separator>
      <Text style={styles.separatorStyle}>{title}</Text>
    </Separator>
  );

  return (
    <Container>
      {CONFIG.surveyDone ?
        (CONFIG.userRole == "ROLE_USER" ?
          //survey=true role=end_user
          <CommonHeader
            text={CONFIG.selectedSubuserNameSurname}
            isBackActive={false}
            onPressSettings={() => {
              navigation.navigate('Settings', {
                isEdit: false,
              });
            }}
            isEditText={false}
          />
          :
          //survey=true role=admın
          <CommonHeader
            text={CONFIG.selectedSubuserNameSurname}
            isBackActive={true}
            onPressBack={() => {
              navigation.navigate('ListUsers');
            }}
            isEditText={false}
            isSettingsActive={false}
          />
        )
        :
        (CONFIG.userRole == "ROLE_USER" ?
          //survey=false role=end_user
          <CommonHeader
            text={CONFIG.selectedSubuserNameSurname}
            isBackActive={false}
            isEditText={false}
            isSettingsActive={true}
            onPressSettings={() => {
              navigation.navigate('Settings', {
                isEdit: false,
              });
            }}
          />
          :
          //survey=false role=admın
          <CommonHeader
            text={CONFIG.selectedSubuserNameSurname}
            isBackActive={true}
            onPressBack={() => {
              navigation.navigate('ListUsers');
            }}
            isEditText={false}
            onPressSettings={() => {
              navigation.navigate('CreateUser', {
                isEdit: true,
              });
            }}
            isSettingsActive={false}
          />
        )
      }
      {formattedUsers.length < 1 ? <Text style={{ textAlign: 'center', marginTop: '10%' }}>Kayıtlı Ölçüm Bulunamadı!</Text> : null}
      <SectionList
        sections={formattedUsers}
        refreshing={refreshing}
        tintColor="#F8852D"
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          <View>
            <Item title={item.name} id={item.id} />
          </View>
        }
        renderSectionHeader={({ section: { title } }) => (
          <SeparatorHeader title={title} />
        )}
      />
      <Content contentContainerStyle={styles.content} />
      <View style={styles.buttonAndTextView}>
        <CommonButton
          text={"Ölçüm Al"}
          onPress={() => {
            CONFIG.isBefore = true;
            handleBleSearch();
            navigation.navigate('BleSearchDevices');
          }}
          buttonColor={COLORS.buttonBlue}
          buttonWidth={'80%'}
          buttonMarginTop={12}
          buttonMarginBottom={32}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '85%',
  },
  titleText: {
    width: '80%',
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
    fontSize: 18,
    color: COLORS.darkerTextColor,
    marginBottom: 16,
  },
  expText: {
    width: '80%',
    textAlign: 'center',
    fontFamily: DEFAULT_FONT,
    fontSize: 15,
    color: COLORS.darkerTextColor,
    marginBottom: 16,
  },
  buttonAndTextView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserPage;
