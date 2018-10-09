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
  View,
  FlatList,
  ActivityIndicator,
  Image
} from 'react-native';
import BinanceAdapter from './BinanceAdapter';
import Wallet from './Wallet';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      listAsset: [],
      loading: true
    }
  }

  componentDidMount() {
    this.initWallet();
  }

  _keyExtractor = (item, index) => item.id;

  render() {
    return (
      <View style={styles.container}>
        {this._renderLoading()}
        <FlatList
          data={this.state.listAsset}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </View>
    );
  }

  _renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image
        style={{width: 30, height: 30}}
        source={{uri: item.iconUrl}}
      />
      <Text style={{marginLeft: 8}}>{item.name}</Text>
      <Text style={{marginLeft: 8}}>{item.balance}</Text>
      <Text style={{marginLeft: 8}}>{item.totalPrice()}</Text>
    </View>
  )

  _renderLoading = () => {
    if (this.state.loading) {
      return <ActivityIndicator/>
    }
    return null;
  }


  initWallet() {
    let apiKey = "04yScWqaH7CpbnCNX9PtXIjLYOXnLWweFPKxNlFZN3TtCcEdIyGcz0a1ddtvpdTs";
    let secretKey = "SIeFsjnh6HTPEi5pUHxSDsA7Xhx5ip74F9kIF8oN9SlTkaKsyUTZgMwd0R8sI9ap";

    let binance = new BinanceAdapter(apiKey, secretKey);

    let wallet = new Wallet(binance);
    wallet.setName('Test wallet');

    binance.getCoinMap(() => {
      binance.fetchListAsset(
        () => {
          this.setState({
            listAsset: binance.getListAsset(),
            loading: false
          })
        },
        () => {
          this.setState({loading: false})
        }
      );
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 64,
  },
  itemContainer: {
    height: 50,
    marginLeft: 10,
    flexDirection: 'row',
  },
});
