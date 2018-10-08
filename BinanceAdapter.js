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
      .then(function (response) {
        let balances = response.data.balances;
        for (let i = 0; i < balances.length; i++) {
          let obj = balances[i];
          let asset = new Asset(obj.asset, '', '', obj.free, 0.0);
          if (asset.balance > 0) {
            console.log(asset);
            this.listAsset.push(asset);
          }
        }
        console.log(this.listAsset);
      })
      .catch(function (error) {
        fetchErrorCallback();
    })
      .then(function () {

      });
  }
}

const encodeGetParams = p =>
  Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");