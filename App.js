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
  Button,
  SafeAreaView
} from 'react-native';
import BinanceAdapter from './BinanceAdapter';
import PoloniexAdapter from './PoloniexAdapter';
import Wallet from './Wallet';

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      wallet: null,
      loading: true
    }
  }

  componentDidMount() {
    this.initBinanceWallet();
  }

  _keyExtractor = (item, index) => item.id;

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.container}>
          {this._renderWalletView()}
          {this._renderLoading()}
          {this._renderListAsset()}
          <View style={{height: 2, backgroundColor: 'rgba(52, 52, 52, 0.1)'}}></View>
          <View style={styles.buttonContainer}>
            <Button
              title="Binance"
              onPress={() => this.initBinanceWallet()}
            />
            <Button
              title="Poloniex"
              onPress={() => this.initPoloniexWallet()}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  _renderItem = ({item}) => (
    <View style={{marginLeft: 10, marginRight: 10}}>
      <View style={{height: 1, backgroundColor: 'rgba(52, 52, 52, 0.1)'}}></View>
      <View style={styles.itemContainer}>
        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{width: 20, height: 20}}
            source={{uri: item.iconUrl}}
          />
          <Text style={{marginLeft: 8}}>{item.name}</Text>
        </View>
        <Text style={{flex: 1, textAlign: 'right'}}>{'$' + roundNum(item.balance)}</Text>
        <Text style={{flex: 1, textAlign: 'right'}}>{'$'+ roundNum(item.totalPrice())}</Text>
      </View>View>
    </View>
  )

  _renderLoading = () => {
    if (this.state.loading) {
      return <ActivityIndicator style={styles.loadingView}/>
    }
    return null;
  }

  _renderListAsset = () => {
    if (this.state.wallet) {
      return <FlatList
                data={this.state.wallet.exchange.getListAsset()}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                ListHeaderComponent={this._renderHeader}
                stickyHeaderIndices={[0]}
              />
    }
    return null;
  }

  _renderHeader = () => (
    <View style={styles.headerView}>
      <Text style={styles.nameTitle}>Name</Text>
      <Text style={styles.otherTitle}>Price</Text>
      <Text style={styles.otherTitle}>Balance</Text>
    </View>
  );

  _renderWalletView = () => {
    if (this.state.wallet) {
      return (
        <View style={styles.walletContainer}>
          <View style={styles.walletInfo}>
            <Image style={styles.walletLogo}/>
            <Text style={styles.walletName}>{this.state.wallet.name}</Text>
          </View>
          <View style={{height: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)'}}></View>
          <View style={styles.walletBalanceView}>
            <Text style={styles.balanceTitle}>BALANCE</Text>
            <View style={styles.balanceContainer}>
              <Text style={{color: '#fff'}}>{roundNum(this.state.wallet.exchange.totalBalance())}</Text>
            </View>
          </View>
        </View>
      )
    }
    return null;
  }

  initBinanceWallet() {
    let apiKey = "04yScWqaH7CpbnCNX9PtXIjLYOXnLWweFPKxNlFZN3TtCcEdIyGcz0a1ddtvpdTs";
    let secretKey = "SIeFsjnh6HTPEi5pUHxSDsA7Xhx5ip74F9kIF8oN9SlTkaKsyUTZgMwd0R8sI9ap";

    let binance = new BinanceAdapter(apiKey, secretKey);

    let wallet = new Wallet(binance);
    wallet.setName('Binance wallet');

    this.setState({loading: true, wallet});

    wallet.exchange.getCoinMap(() => {
      wallet.exchange.fetchListAsset(
        () => {
          this.setState({
            wallet,
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
    let apiKey = "HHKN11CO-DH3QSNSG-5XXH75C8-5E693MHA";
    let secretKey = "6668fb27e9d80b2fc73d34aa857fdadd25d3b4411be364f9b0dbbd056f5cbc3ee67a81ee020ed005a98dc1aeab17fe553d06299809f29e327707ff1b7941d297";

    let poloniex = new PoloniexAdapter(apiKey, secretKey);

    let wallet = new Wallet(poloniex);
    wallet.setName('Poloniex Wallet');

    this.setState({loading: true, wallet});

    wallet.exchange.getCoinMap(() => {
      wallet.exchange.fetchListAsset(
        () => {
          this.setState({
            wallet,
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

const roundNum = (num) => {
  return Math.round(num * 10000) / 10000;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  walletContainer: {
    height: 120,
    backgroundColor: '#4A77AF',
    marginLeft: 10,
    marginRight: 10,
    borderRadius:10,
  },
  walletInfo: {
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
  },
  walletLogo: {
    height: 30,
    width: 30,
    backgroundColor: '#fff',
    marginLeft: 15,
    borderRadius:15,
  },
  walletName: {
    marginLeft: 8,
    color: '#fff',
  },
  walletBalanceView: {
    alignItems: 'center',
  },
  balanceTitle: {
    marginTop: 8,
    color: '#3F9ECF',
    fontSize: 12,
  },
  balanceContainer: {
    height: 30,
    width: 200,
    backgroundColor: '#386B96',
    borderRadius: 15,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    height: 50,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  loadingView: {
    marginTop: 10,
  },
  headerView: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  nameTitle: {
    fontSize: 12,
    flex: 2,
  },
  otherTitle: {
    fontSize: 12,
    textAlign: 'right',
    flex: 1,
  }
});
