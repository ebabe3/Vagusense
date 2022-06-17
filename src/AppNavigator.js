import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './pages/login';
import Forgot from './pages/forgot';
import Register from './pages/register';
import ListUsers from './pages/listusers';
import BleSearch from './pages/blesearch';
import CheckEmail from './pages/checkemail';
import Settings from './pages/settings';
import UpdateAccount from './pages/updateaccount';
import UpdatePassword from './pages/updatepassword';
import UserPage from './pages/userpage';
import CreateUser from './pages/createuser';
import Survey from './pages/survey';
import BleConnected from './pages/bleconnected';
import BleControl from './pages/blecontrol';
import FwUpdate from './pages/fwupdate';
import AdminPanel from './pages/adminpanel';
import StimEnd from './pages/stimend';
import UpdateEndUser from './pages/updateEndUser';
import ResetPassword from './pages/resetPassword';
import ConfirmEmail from './pages/confirmEmail';
import StimulationDetails from './pages/stimulationDetails';

const Stack = createNativeStackNavigator();

const Navigator = () => {
    return(
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="BleSearch"
          component={BleSearch}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="CheckEmail"
          component={CheckEmail}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Forgot"
          component={Forgot}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="ListUsers"
          component={ListUsers}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="UpdateAccount"
          component={UpdateAccount}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="UpdatePassword"
          component={UpdatePassword}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="CreateUser"
          component={CreateUser}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="UserPage"
          component={UserPage}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="StimulationDetails"
          component={StimulationDetails}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="Survey"
          component={Survey}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="BleConnected"
          component={BleConnected}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="BleControl"
          component={BleControl}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="FwUpdate"
          component={FwUpdate}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="AdminPanel"
          component={AdminPanel}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="StimEnd"
          component={StimEnd}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="UpdateEndUser"
          component={UpdateEndUser}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
              headerShown: false,
          }}
        />
        <Stack.Screen
          name="ConfirmEmail"
          component={ConfirmEmail}
          options={{
              headerShown: false,
          }}
        />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigator;