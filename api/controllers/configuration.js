const util = require('util');

const model = require('../models/configuration');


function upsert(req, res) {
  model.upsert(req.swagger.params.body.value).then(() => {
    res.set('Content-Type', 'text/plain')
      .status(201)
      .send();
  });
}

function read(req, res) {
  const ifNoneMatch = req.swagger.params['If-None-Match'];
  const { client, version } = req.swagger.params;
  const etag = ifNoneMatch &&
        ifNoneMatch.value &&
        ifNoneMatch.value !== null &&
        ifNoneMatch.value.match(/^W\/"([0-9]+)"$/i) &&
        parseInt(ifNoneMatch.value.match(/^W\/"([0-9]*)"$/)[1]);
  const record = model.find({
    client: client.value,
    version: version.value,
    etag
  }).then(record => {
    if (record) {
      const etag = `W/"${record.etag}"`;
      delete record.etag;
      res.status(200).set('ETag', etag).json(record);
    } else {
      res.status(304).send();
    }
  });
}

module.exports = {
  upsert,
  read
};
