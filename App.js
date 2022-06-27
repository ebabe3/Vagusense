import React, { useEffect} from 'react';

import { Root} from 'native-base';
import SplashScreen from 'react-native-splash-screen';

import { CONFIG } from './src/data/config';
import { setLanguage } from './src/data/strings';

import Navigator from './src/AppNavigator';

function App() {
  useEffect(() => {
    checkLanguage();
    SplashScreen.hide();
  }, []);

  const checkLanguage = async () => {
    let language = await AsyncStorage.getItem(CONFIG.languageKey);
    if (language) {
      setLanguage(language);
    }
  };
  return (
    <Root>
      <Navigator />
    </Root>
  )
}


export default App;
