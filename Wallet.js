import ExchangeAdapter from './ExchangeAdapter';

export default class Wallet {
  name: string;
  exchange: ExchangeAdapter;

  constructor(exchange) {
    this.exchange = exchange;
  }

  setName(name) {
    this.name = name;
  }
}