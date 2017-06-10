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

const configRecordSchema = new Schema({
  client: String,
  version: String,
  etag: Number,
  key: String,
  value: String
});

configRecordSchema.plugin(require('mongoose-create-or-update'));

const configEtagSchema = new Schema({
  client: String,
  version: String,
  etag: { type: Number, default: 1 }
});

const ConfigRecord = mongoose.model('ConfigRecord', configRecordSchema);
const ConfigEtag = mongoose.model('ConfigEtag', configEtagSchema);

function recordsReducer (res, { key, value }) {
    // return ({ ...res, key, value });
}

module.exports = {
  find: ({ client, version }) => {
    return ConfigRecord.find({ client, version })
      .then(records => {
        if (records.length === 0) return null;
        return records[0];
        // return records.reduce(recordsReducer);
      });
  },
  upsert: ({ client, version, key, value }) => {
    return ConfigRecord.createOrUpdate({ client, version, key },
                                       { client , version, [key]: value });
    // const id = counter ++;
    // storage.set( client + version , { key, value, id: id.toString() });
    // return Promise.resolve(id.toString());
  },
  reset: () => {
    ConfigRecord.collection.drop();
    // storage.clear();
    // counter = 0;
  }
};
