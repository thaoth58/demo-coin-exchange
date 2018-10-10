import Asset from "./Asset";
const axios = require('axios');

export default class ExchangeAdapter {
  name: string;
  apiKey: string;
  secretKey: string;
  listAsset: Array;
  baseUrl: string;
  coinMap: Object;
  baseIconUrl: string;

  constructor(apiKey, secretKey) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.listAsset = new Array();
    this.coinMap = new Map();
    this.baseIconUrl = 'https://s2.coinmarketcap.com/static/img/coins/64x64/';
  }

  totalBalance() {
    var result = 0;
    for (let asset of this.listAsset) {
      result += asset.totalPrice();
    }
    return result;
  }

  updateKeys(apiKey, secretKey) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
  }

  fetchListAsset(fetchSuccessCallback, fetchErrorCallback) {
    //Need decrypt apiKey + secretKey before fetching.
    throw "Abstract method fetchListAsset not implemented";
  }

  getListAsset() {
    return this.listAsset;
  }

  getCoinMap(callback) {
    //Check coin map exist or not
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

export const encodeGetParams = p =>
  Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");