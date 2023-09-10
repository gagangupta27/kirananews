import {AppRegistry, View} from 'react-native';

import App from './App';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import {name as appName} from './app.json';
import {useEffect} from 'react';

const Main = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: '#fff', alignItems: 'flex-start'}}>
      <App />
    </GestureHandlerRootView>
  );
};

export default Main;

AppRegistry.registerComponent(appName, () => Main);
AppRegistry.registerHeadlessTask('fetchHeadlines', () =>
  require('./src/utility/fetchHeadlines'),
);
