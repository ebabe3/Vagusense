import React, { useEffect} from 'react';

import { NativeBaseProvider, Root} from 'native-base';
import SplashScreen from 'react-native-splash-screen';
import codePush from 'react-native-code-push';

import { CONFIG } from './src/data/config';
import { setLanguage } from './src/data/strings';

import Navigator from './src/AppNavigator';

function App() {
  useEffect(() => {
    checkLanguage();
    SplashScreen.hide();
    codePush.sync({
      installMode: codePush.InstallMode.IMMEDIATE,
      updateDialog: true
    });
  }, []);

  const checkLanguage = async () => {
    let language = await AsyncStorage.getItem(CONFIG.languageKey);
    if (language) {
      setLanguage(language);
    }
  };
  return (
    <Root >
      <Navigator />
    </Root>
  )
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE,
  updateDialog: true
}

export default codePush(codePushOptions)(App);
