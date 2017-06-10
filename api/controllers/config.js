const util = require('util');

const model = require('../models/config');


function upsert(req, res) {
  console.log(req.swagger.params.body.value);
  res.status(201).json({});
}

function read(req, res) {
  const { client, version } = req.swagger.params;
  const record = model.find({
    client: client.value,
    version: version.value
  }).then(record => {
    if (record) {
      res.status(200).send();
    } else {
      res.status(304).send();
    }
  });
}

module.exports = {
  upsert,
  read
};
