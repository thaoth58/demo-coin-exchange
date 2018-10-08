import Asset from "./Asset";

export default class ExchangeAdapter {
  name: string;
  apiKey: string;
  secretKey: string;
  listAsset: Array;
  host: string;

  constructor(apiKey, secretKey) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.listAsset = new Array();
  }

  totalBalance() {
    return 0;
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