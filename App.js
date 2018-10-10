/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  Button
} from 'react-native';
import BinanceAdapter from './BinanceAdapter';
import PoloniexAdapter from './PoloniexAdapter';
import Wallet from './Wallet';

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
    this.initBinanceWallet();
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
        <View style={styles.buttonContainer}>
          <Button
            title="Binance"
            onPress={() => this.initBinanceWallet()}
            color="#FFF"
          />
          <Button
            title="Poloniex"
            onPress={() => this.initPoloniexWallet()}
            color="#FFF"
          />
        </View>
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


  initBinanceWallet() {
    this.setState({loading: true, listAsset: []});
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

  initPoloniexWallet() {
    this.setState({loading: true, listAsset: []});
    let apiKey = "HHKN11CO-DH3QSNSG-5XXH75C8-5E693MHA";
    let secretKey = "6668fb27e9d80b2fc73d34aa857fdadd25d3b4411be364f9b0dbbd056f5cbc3ee67a81ee020ed005a98dc1aeab17fe553d06299809f29e327707ff1b7941d297";

    let poloniex = new PoloniexAdapter(apiKey, secretKey);

    let wallet = new Wallet(poloniex);
    wallet.setName('Test wallet');

    poloniex.getCoinMap(() => {
      poloniex.fetchListAsset(
        () => {
          this.setState({
            listAsset: poloniex.getListAsset(),
            loading: false
          })
        },
        () => {
          this.setState({loading: false})
        }
      );
    })
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
  buttonContainer: {
    height: 50,
    backgroundColor: '#bb5eff',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
});
