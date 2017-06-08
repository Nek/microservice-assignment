const should = require('should');
const request = require('supertest');
const server = require('../../../app');

describe('controllers', function() {
  describe('config', function() {
    describe.skip('POST /config', () => {
      it('creates config and returns 201 ', (done) => {
        /*
          HTTP/1.1 POST /config
          { "client": "ios", "version": "267", "key": "ads_endpoint", "value": "/devads" }

          HTTP1/1.1 201 Created
          */
        done();
      });
      it.skip('updates config and returns 201 ', (done) => done());
    });
    describe.skip('GET /config', () => {
      it('returns 304 for missing config', (done) => {
        /*
          HTTP/1.1 GET /config/ios/266

          HTTP/1.1 304 Not Modified
        */

        request(server)
          .get('/config/ios/266')
          .set('Accept', 'application/json')
          .expect(304)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.eql({});

            done();
          });
      });
      it.skip('returns 200 with ETag and all key value pairs if no ETag is provided', (done) => done());
      it.skip('returns 200 with ETag and key value pairs created after provided ETag', (done) => done());
      it.skip('returns 304 if provided ETag is the latest one', (done) => done());
    });
  });
});
