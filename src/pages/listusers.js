import React, { useState, useEffect } from 'react';
import { Text, SectionList, TextInput, View, StyleSheet } from 'react-native';

import { Container, Icon, Separator, ListItem, Left, Right } from 'native-base';

import CommonHeader from '../components/commonheader.js';
import CommonButton from '../components/commonbutton.js';

import { COLORS } from '../style/colors';
import { DEFAULT_FONT } from '../style/fonts';
import { getString } from '../data/strings';
import { CONFIG } from '../data/config';

const ListUsers = ({ navigation, route }) => {
  const [originalAllUsers, setOriginalAllUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [formattedUsers, setFormattedUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  //Process user info
  useEffect(() => {
    setFormattedUsers(formatUserData(allUsers));
  }, [allUsers]); // eslint-disable-line react-hooks/exhaustive-deps

  //Get user info
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllUsers();
    });
    return unsubscribe;
  }, [navigation]);

  //Get user info
  useEffect(() => {
    let tempArray = originalAllUsers
      .filter(function (item) {
        return (
          item.humanId.toLowerCase().includes(searchText.toLowerCase()),
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.surname.toLowerCase().includes(searchText.toLowerCase())
        );
      })
      .map(function ({ active, age, gender, height, name, patientId, surname, humanId }) {
        return { active, age, gender, height, name, patientId, surname, humanId };
      });
    setAllUsers(tempArray);
  }, [searchText]); // eslint-disable-line react-hooks/exhaustive-deps

  const getAllUsers = () => {
    fetch(CONFIG.baseServer + 'api/patients/getMyPatients', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + CONFIG.token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setOriginalAllUsers(responseData.Items.filter(Items => Items.isActive == true));
        setAllUsers(responseData.Items.filter(Items => Items.isActive == true));
      })
      .catch((error) => {
        console.info(error);
      });
  };

  const formatUserData = (array) => {
    let formattedData = [];

    for (var i = 0; i < array.length; i++) {
      array[i].name = capitalizeFirstLetter(array[i].name);
      array[i].surname = capitalizeFirstLetter(array[i].surname);
      array[i].humanId = capitalizeFirstLetter(array[i].humanId);
    }

    array.sort(function (data1, data2) {
      var compared = compareByIndex(data1, data2, 'name');
      return compared === 0
        ? -compareByIndex(data1, data2, 'surname')
        : compared;
    });

    for (var i = 0; i < array.length; i++) {
      var user = array[i];
      var userData = {
        name: user.name + ' ' + user.surname + ' - ' + user.humanId,
        id: user.patientId,
      };

      if (formattedData.length === 0) {
        formattedData[0] = { title: userData.name[0], data: [userData] };
      } else if (
        formattedData[formattedData.length - 1].title === userData.name[0]
      ) {
        formattedData[formattedData.length - 1].data.push(userData);
      } else {
        formattedData.push({ title: userData.name[0], data: [userData] });
      }
    }

    return formattedData;
  };

  const compareByIndex = (data1, data2, index) => {
    return data1[index] === data2[index]
      ? 0
      : data1[index] < data2[index]
        ? -1
        : 1;
  };

  const capitalizeFirstLetter = (string) => {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return null;
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
        navigation.navigate('UserPage', {
          isEdit: false,
        });
      }}>
      <Left>
        <Text style={styles.itemTextStyle}>{title}</Text>
      </Left>
      <Right>
        <Text style={styles.editTextStyle} onPress={() => {
          CONFIG.patientId = id;
          navigation.navigate('CreateUser', {
            isEdit: true,
          });
        }}>
          {getString('edit')}
        </Text>

      </Right>

    </ListItem>
  );

  const SeparatorHeader = ({ title }) => (
    <Separator bordered>
      <Text style={styles.separatorStyle}>{title}</Text>
    </Separator>
  );

  return (
    <Container>
      <CommonHeader
        text={getString('listOfUsers')}
        isBackActive={false}
        onPressSettings={() => {
          navigation.navigate('Settings');
        }}
        isEditText={false}
      />
      <View style={styles.searchbarBackStyle}>
        <View style={styles.searchInnerViewStyle}>
          <Icon name="search" style={styles.iconStyle} />
          <TextInput
            style={styles.textInputStyle}
            underlineColorAndroid={'transparent'}
            autoCorrect={false}
            onChangeText={(text) => {
              setSearchText(text);
            }}
            placeholder={getString('search')}
            placeholderTextColor={COLORS.lightTextColor}
            value={searchText}
          />
        </View>
      </View>
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
      <View style={styles.textAndButtonView}>
        <Text style={styles.startStimText}>{getString('toStartSim')}</Text>
        <CommonButton
          text={getString('createUser')}
          onPress={() => {
            navigation.navigate('CreateUser', {
              isEdit: false,
            });
          }}
          buttonColor={COLORS.buttonBlue}
          buttonWidth={'60%'}
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

export default ListUsers;
