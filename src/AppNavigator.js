import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={login}
          options={() =>{
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
