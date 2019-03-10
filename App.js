import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './Navigation';
import { Provider } from 'react-redux';
import store from './src/Store/store';
import { Constants } from 'expo';
console.disableYellowBox = true;

export default class App extends React.Component {

  render() {
    return (
        <Provider store={store}>
        <Navigation/>
        </Provider>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBar: {
    backgroundColor: "#C2185B",
    height: Constants.statusBarHeight,
  },
});
