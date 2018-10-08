import Asset from "./Asset";

export default class ExchangeAdapter {
  name: string;
  apiKey: string;
  secretKey: string;
  listAsset: [Asset];
  baseUrl: string;

  constructor(apiKey, secretKey) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.listAsset = [];
  }

  totalBalance() {
    var result = 0;
    // for asset in this.listAsset {
    //   result += asset.totalPrice()
    // }
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
}