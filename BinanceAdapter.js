import ExchangeAdapter from "./ExchangeAdapter";
import Asset from "./Asset";

const axios = require('axios');

export default class BinanceAdapter extends ExchangeAdapter {
  constructor(apiKey, secretKey) {
    super(apiKey, secretKey);
    this.name = "Binance";
    this.baseUrl = "https://api.binance.com/api/v3/";
  }

  fetchListAsset(fetchSuccessCallback, fetchErrorCallback) {
    var SHA256 = require("crypto-js/hmac-sha256");
    var params = {
      timestamp: Date.now()
    };

    params['signature'] = SHA256(encodeGetParams(params), this.secretKey).toString();

    let headers = {'X-MBX-APIKEY': this.apiKey};

    axios.get(this.baseUrl + 'account', {
      params: params,
      headers: headers
      })
      .then((response) => {
        let balances = response.data.balances;
        var listAsset = [];

        for (let i = 0; i < balances.length; i++) {
          let obj = balances[i];
          if (obj.free > 0) {
            let asset = new Asset(obj.asset, '', '', obj.free, 0.0);
            listAsset.push(asset);
          }
        }
        this.listAsset = listAsset;

        this.fetchListPrice(fetchSuccessCallback);
      })
      .catch((error) => {
        fetchErrorCallback();
      })
      .then(() => {
      });
  }


  fetchListPrice(successCallback) {
    axios.get(this.baseUrl + 'ticker/price')
      .then((response) => {
        let data = response.data;

        this.updatePrice(data, successCallback);
      })
      .catch((error) => {
        console.log(error);
        fetchErrorCallback();
      })
      .then(() => {

      });
  }

  updatePrice(data, successCallback) {
    let BTCUSDT = 0;
    let ETHUSDT = 0;
    let BNBUSDT = 0;

    for (let i = 0; i < data.length; i++) {
      let ticker = data[i];
      if (ticker.symbol === 'BTCUSDT') {
        BTCUSDT = ticker.price;
      } else if (ticker.symbol === 'ETHUSDT') {
        ETHUSDT = ticker.price;
      } else if (ticker.symbol === 'BNBUSDT') {
        BNBUSDT = ticker.price;
      }
    }

    for (let i = 0; i < this.listAsset.length; i++) {
      let asset = this.listAsset[i];
      for (let j = 0; j < data.length; j++) {
        let ticker = data[j];
        if (ticker.symbol == asset.name + 'USDT') {
          asset.price = ticker.price;
          break;
        } else if (ticker.symbol == asset.name + 'BTC') {
          asset.price = ticker.price * BTCUSDT;
          break;
        } else if (ticker.symbol == asset.name + 'ETH') {
          asset.price = ticker.price * ETHUSDT;
          break;
        } else if (ticker.symbol == asset.name + 'BNB') {
          asset.price = ticker.price * BNBUSDT;
          break;
        }
      }
    }

    successCallback();
  }
}

const encodeGetParams = p =>
  Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");