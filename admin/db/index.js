const mongoose = require("mongoose");
const Logger = require("../logger");
const models = require("./models");

class MongoDB {
  constructor(config) {
    this.config = config;
    this.models = models;
    this.logger = new Logger("MongoDB");
    this.connectionString = `${config.url}/${config.database}`;

    this.logger.info(`Starting...`);
    this.init();
  }

  async init() {
    this.logger.info("Initializing:");
    this.logger.debug(this.config);
    try {
      this.mongoose = await mongoose.connect(
        this.connectionString,
        this.config.mongooseCfg
      );
    } catch (e) {
      return this.logger.error(e);
    }

    this.logger.info(`Connected: ${this.connectionString}`);

    this.logger.info("Initialized");
  }

  async createWallet(wallet) {
    return new this.models.Wallet(wallet).save();
  }
  async getWallet(address) {
    return this.models.Wallet.findOne({ address });
  }
  async getWallets() {
    return this.models.Wallet.find({});
  }
  async saveTransaction(tx) {
    return new this.models.Transaction(tx).save();
  }
  async getTransaction(txid) {
    return this.models.Transaction.findOne({ txid });
  }
  async getTransactionsForAddress(address) {
    return this.models.Transaction.find({ address });
  }

  async savePrice(price) {
    return this.models.Price.findOneAndUpdate(
      {
        exchange: price.exchange,
        symbol: price.symbol,
        timestamp: price.timestamp,
      },
      price,
      { upsert: true }
    );
  }
  async getPrice(exchange, symbol, timestamp) {
    return this.models.Price.findOne({
      exchange,
      symbol,
      timestamp: { $lte: timestamp },
    }).sort({
      timestamp: -1,
    });
  }
  async getPrices(
    exchange,
    symbol,
    timeStart = new Date(0),
    timeEnd = new Date()
  ) {
    return this.models.Price.find({
      exchange,
      symbol,
      timestamp: { $gte: timeStart, $lt: timeEnd },
    });
  }
  async averagePriceInDateRange(
    symbol,
    timeStart = new Date(0),
    timeEnd = new Date()
  ) {
    return this.models.Price.aggregate([
      {
        $match: {
          symbol,
          timestamp: { $gte: timeStart, $lt: timeEnd },
        },
      },
      { $group: { _id: "Average", avgPrice: { $avg: "$price" } } },
    ]);
  }
  async averagePriceForDay(symbol, day = new Date()) {
    // start = same Day, 12:01 AM
    // end = same Day, midnight
    // return all values between start/end
    // average the price.
    return this.models.Price.aggregate([
      {
        $match: {
          symbol,
          timestamp: { $gte: date, $lt: date },
        },
      },
      { $group: { _id: "Average", avgPrice: { $avg: "$price" } } },
    ]);
  }
}

module.exports = MongoDB;
