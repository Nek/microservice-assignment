const storage = new Map();
let counter = 0;

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const DB_ADDRESS = 'mongodb://mongo:27017';
mongoose.connect(DB_ADDRESS);

const Schema = mongoose.Schema;

/*

  {
  client: String,
  version: String,
  key: String,
  value: String
  }

  */

/*
  UPDATE
  нужен последний етаг
  device version
  1. найти конфиг
  2. взять последний етаг
  3. вставить/обновить ключ значение с последним етагом

  FIND без етаг
  найти запись и смерджить все ключ значения
  FIND с етаг
  найти запись и 
  нужны device version etag
*/

const configSchema = new Schema({
  client: String,
  version: String,
  etag: Number,
  key: String,
  value: String
});

const latestEtagSchema = new Schema({
  client: String,
  version: String,
  etag: { type: Number, default: 0 }
});

const Config = mongoose.model('Config', configSchema);
const LatestEtag = mongoose.model('LatestEtag', latestEtagSchema);

function createConfigurationObject(record) {
  const { key, value, etag } = record;
  return { [key] : value, etag };
};

module.exports = {
  find: ({ client, version, etag }) => {
    const query = Object.assign({ client, version },
                                etag ? { etag: { $gt: etag }} : {});
    return Config.find(query)
      .sort('etag')
      .exec()
      .then(records => {
        if (records.length === 0) return null;
        return records.reduce((res,record) => Object.assign({}, res, createConfigurationObject(record)), {});
      });
  },
  upsert: ({ client, version, key, value }) => {
    return LatestEtag.findOneAndUpdate(
      {client, version},
      {client, version, $inc: { etag: 1}},
      {upsert: true, new: true, setDefaultsOnInsert: true})
      .then(({ etag }) => Config.findOneAndUpdate(
        { client, version, key },
        { client , version, key, value, etag },
        { upsert: true, new: true}));
  },
  reset: () => {
    return Promise.all([Config.collection.drop(), LatestEtag.collection.drop()]);
  }
};
