import Asset from "./Asset";
const axios = require('axios');

export default class ExchangeAdapter {
  name: string;
  apiKey: string;
  secretKey: string;
  listAsset: array;
  baseUrl: string;
  coinMap: map;

  constructor(apiKey, secretKey) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.listAsset = new Array();
    this.coinMap = new Map();
  }

  totalBalance() {
    var result = 0;
    for (let i = 0; i < this.listAsset.length; i++) {
      let asset = this.listAsset[i];
      result += asset.totalPrice();
    }
    return result;
  }

  updateKeys(apiKey, secretKey) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
  }

  fetchListAsset(fetchSuccessCallback, fetchErrorCallback) {
    throw "Abstract method fetchListAsset not implemented";
  }

  getListAsset() {
    return this.listAsset;
  }

  getCoinMap(callback) {
    let url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map';

    axios.get(url, {
      headers: {
        'X-CMC_PRO_API_KEY': 'd8dedcfb-dd39-4587-8ce6-11b72bf392b4'
      }
    })
      .then((response) => {
        this.coinMap = response.data.data;
      })
      .catch((error) => {
      })
      .then(() => {
        callback();
      });
  }
}