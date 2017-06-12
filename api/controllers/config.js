const util = require('util');

const model = require('../models/config');


function upsert(req, res) {
  res.status(201).send();
}

function read(req, res) {
  const { client, version } = req.swagger.params;
  const record = model.find({
    client: client.value,
    version: version.value
  }).then(record => {
    if (record) {
      res.status(200).json({});
    } else {
      res.status(304).send();
    }
  });
}

module.exports = {
  upsert,
  read
};
