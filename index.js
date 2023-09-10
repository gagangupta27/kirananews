import {AppRegistry, View} from 'react-native';

import App from './App';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {name as appName} from './app.json';

const Main = () => {
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
