export default class Asset {
  name: string;
  iconUrl: string;
  type: string;
  balance: double;
  price: double;

  constructor(name, iconUrl, type, balance, price) {
    this.name = name;
    this.iconUrl = iconUrl;
    this.type = type;
    this.balance = balance;
    this.price = price;
  }

  totalPrice() {
    return this.balance * this.price;
  }
}