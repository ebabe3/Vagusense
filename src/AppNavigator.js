import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './pages/login';
import Register from './pages/register';
import Forgot from './pages/forgot';
import CheckEmail from './pages/checkemail';
import ListUsers from './pages/listusers';
import Settings from './pages/settings';
import UpdateAccount from './pages/updateaccount';
import UpdatePassword from './pages/updatepassword';
import UserPage from './pages/userpage';
import CreateUser from './pages/createuser';
import Survey from './pages/survey';
import BleSearch from './pages/blesearch';
import BleConnected from './pages/bleconnected';
import BleControl from './pages/blecontrol';
import FwUpdate from './pages/fwupdate';
import AdminPanel from './pages/adminpanel';
import StimEnd from './pages/stimend';
import UpdateEndUser from './pages/updateEndUser';
import ResetPassword from './pages/resetPassword';
import ConfirmEmail from './pages/confirmEmail';
import StimulationDetails from './pages/stimulationDetails';
import BleSearchDevices from './pages/researcherPages/bleSearchDevices';
import ListDevices from './pages/researcherPages/listDevices';
import BleConnectSelectedDevice from './pages/researcherPages/bleConnectSelectedDevice';
import LiveMeasurement from './pages/vagusensePages/measurementPages/liveMeasurement';
import OnlyGSR from './pages/vagusensePages/measurementPages/onlyGSR';
import SelectMeasurement from './pages/vagusensePages/selectMeasurement';
import NormalMeasurement from './pages/vagusensePages/measurementPages/normalMeasurement';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="BleSearchDevices"
          component={BleSearchDevices}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="BleConnectSelectedDevice"
          component={BleConnectSelectedDevice}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="ListDevices"
          component={ListDevices}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="BleSearch"
          component={BleSearch}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="CheckEmail"
          component={CheckEmail}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />

        <Stack.Screen
          name="Forgot"
          component={Forgot}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="ListUsers"
          component={ListUsers}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="UpdateAccount"
          component={UpdateAccount}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="UpdatePassword"
          component={UpdatePassword}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="CreateUser"
          component={CreateUser}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="UserPage"
          component={UserPage}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="StimulationDetails"
          component={StimulationDetails}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="Survey"
          component={Survey}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="BleConnected"
          component={BleConnected}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="BleControl"
          component={BleControl}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="FwUpdate"
          component={FwUpdate}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="AdminPanel"
          component={AdminPanel}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="StimEnd"
          component={StimEnd}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="UpdateEndUser"
          component={UpdateEndUser}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="ConfirmEmail"
          component={ConfirmEmail}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="SelectMeasurement"
          component={SelectMeasurement}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="LiveMeasurement"
          component={LiveMeasurement}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="OnlyGSR"
          component={OnlyGSR}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="NormalMeasurement"
          component={NormalMeasurement}
          options={() => {
            return {
              headerShown: false,
            };
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
