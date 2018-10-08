/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import BinanceAdapter from './BinanceAdapter';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    let apiKey = "04yScWqaH7CpbnCNX9PtXIjLYOXnLWweFPKxNlFZN3TtCcEdIyGcz0a1ddtvpdTs";
    let secretKey = "SIeFsjnh6HTPEi5pUHxSDsA7Xhx5ip74F9kIF8oN9SlTkaKsyUTZgMwd0R8sI9ap";

    let binance = new BinanceAdapter(apiKey, secretKey);
    binance.fetchListAsset(
      () => {
        console.log("Success");
      },
      () => {
        console.log("Error");
      }
    );
    console.log(binance);

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
