/**
 * @format
 * Expo prebuild 原生端使用 moduleName "main"，这里需一致
 */
import {AppRegistry} from 'react-native';
import {enableScreens} from 'react-native-screens';
import App from './src/App';

enableScreens();
AppRegistry.registerComponent('main', () => App);
