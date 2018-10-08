import ExchangeAdapter from "./ExchangeAdapter";
const axios = require('axios');

export default class BinanceAdapter extends ExchangeAdapter {
  constructor(apiKey, secretKey) {
    super(apiKey, secretKey);
    this.name = "Binance";
    this.host = "https://api.binance.com/api/v3/account";
  }

  fetchListAsset(fetchSuccessCallback, fetchErrorCallback) {
    var SHA256 = require("crypto-js/hmac-sha256");
    let currentTime = Date.now();
    let sign = SHA256('timestamp=' + currentTime, this.secretKey).toString();

    console.log(sign);
    axios.get(this.host, {
      params: {
        timestamp: currentTime,
        signature: sign
      },
      header: {
        'X-MBX-APIKEY': this.apiKey
      }
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
      console.log(error)
    })
      .then(function () {

      });
  }
}