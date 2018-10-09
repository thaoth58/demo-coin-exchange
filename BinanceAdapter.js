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

        let baseIconUrl = 'https://s2.coinmarketcap.com/static/img/coins/64x64/';

        balances.forEach((obj) => {
          if (obj.free > 0) {
            var iconUrl = '';
            if (this.coinMap.length) {
              for (let i = 0; i < this.coinMap.length; i++) {
                let map = this.coinMap[i];
                if (obj.asset == map.symbol) {
                  iconUrl = baseIconUrl + map.id + '.png'
                  break;
                }
              }
            }
            let asset = new Asset(obj.asset, iconUrl, '', obj.free, 0.0);
            listAsset.push(asset);
          }
        });
        this.listAsset = listAsset;
        console.log(this.listAsset);
        this.fetchListPrice(fetchSuccessCallback);
      })
      .catch((error) => {
        console.log(error);
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
    let mapPrice = [
      {
        name: 'USDT',
        price: 1
      },
      {
        name: 'BTC',
        price: 0
      },
      {
        name: 'ETH',
        price: 0
      },
      {
        name: 'BNB',
        price: 0
      },
    ];

    for (let i = 0; i < data.length; i++) {
      let ticker = data[i];
      for (let j = 1; j < mapPrice.length; j++) {
        let map = mapPrice[j];
        if (ticker.symbol == map.name + 'USDT') {
          map.price = ticker.price;
          break;
        }
      }
    }

    for (let i = 0; i < this.listAsset.length; i++) {
      let asset = this.listAsset[i];
      for (let j = 0; j < data.length; j++) {
        let ticker = data[j];
        var breakThisLoop = false;
        for (k = 0; k < mapPrice.length; k++) {
          let map = mapPrice[k];
          if (ticker.symbol == asset.name + map.name) {
            asset.price = ticker.price * map.price;
            breakThisLoop = true;
            break;
          }
        }
        if (breakThisLoop) {
          break;
        }
      }
    }

    successCallback();
  }
}

const encodeGetParams = p =>
  Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");