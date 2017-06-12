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

const configFieldSchema = new Schema({
  client: String,
  version: String,
  etag: Number,
  key: String,
  value: String
});

const configEtagSchema = new Schema({
  client: String,
  version: String,
  etag: { type: Number, default: 1 }
});

const ConfigField = mongoose.model('ConfigField', configFieldSchema);
const ConfigEtag = mongoose.model('ConfigEtag', configEtagSchema);

function createConfig(record) {
  const { client, version, key, value } = record;
  return { client, version, [key] : value };
};

module.exports = {
  find: ({ client, version }) => {
    return ConfigField.find({ client, version })
      .then(records => {
        if (records.length === 0) return null;
        return records.reduce((res,record) => Object.assign({}, res, createConfig(record)), {});
      });
  },
  upsert: ({ client, version, key, value }) => {
    return ConfigField.findOneAndUpdate(
      { client, version, key },
      { client , version, key, value },
      { upsert: true, new: true})
      .then(createConfig);
  },
  reset: () => {
    return ConfigField.collection.drop();
  }
};
