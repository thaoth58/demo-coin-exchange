import ExchangeAdapter from "./ExchangeAdapter";
import {encodeGetParams} from "./ExchangeAdapter";
import Asset from "./Asset";

const axios = require('axios');

export default class PoloniexAdapter extends ExchangeAdapter {
  constructor(apiKey, secretKey) {
    super(apiKey, secretKey);
    this.name = "Poloniex";
    this.baseUrl = "https://poloniex.com/";
  }

  fetchListAsset(fetchSuccessCallback, fetchErrorCallback) {
    var SHA512 = require("crypto-js/hmac-sha512");
    let params = {
      nonce: Date.now(),
      command: 'returnCompleteBalances'
    };

    let headers = {
      'Key': this.apiKey,
      'Sign': SHA512(encodeGetParams(params), this.secretKey).toString()
    }

    axios({
      method: 'POST',
      url: this.baseUrl + 'tradingApi',
      headers: headers,
      data: encodeGetParams(params)
    })
      .then((response) => {
        let data = response.data;
        let keys = Object.keys(data);
        var listAsset = [];

        keys.forEach((key) => {
          let value = data[key].available;
          let btcValue = data[key].btcValue;
          if (value > 0 && btcValue > 0) {
            var iconUrl = '';
            if (this.coinMap.length) {
              for (let i = 0; i < this.coinMap.length; i++) {
                let map = this.coinMap[i];
                if (key == map.symbol) {
                  iconUrl = this.baseIconUrl + map.id + '.png'
                  break;
                }
              }
            }
            let asset = new Asset(key, iconUrl, '', value, 0.0);
            listAsset.push(asset);
          }
        });
        this.listAsset = listAsset;
        fetchSuccessCallback();
      })
      .catch((error) => {
        fetchErrorCallback();
      });
  }
}