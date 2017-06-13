const should = require('should');
const request = require('supertest');
const server = require('../../../app');

describe('controllers', function() {
  describe('config', function() {
    /*
      HTTP/1.1 POST /config
      { "client": "ios", "version": "267", "key": "ads_endpoint", "value": "/devads" }

      HTTP1/1.1 201 Created
    */
    describe('POST /config', () => {
      it('returns 201', (done) => {
        request(server)
          .post('/config')
          .set('Content-Type','application/json')
          .send({ "client": "ios",
                  "version": "267",
                  "key": "ads_endpoint",
                  "value": "/devads" })
          .expect(201, done);
      });
    });
    /*
      HTTP/1.1 GET /config/ios/267

      HTTP/1.1 200 OK
      ETag: W/"1"
      { "ads_endpoint": "/devads" }
    */
    describe('GET /config/ios/267', () => {
      it('returns 200 with ETag and config data', (done) => {
        request(server)
          .get('/config/ios/267')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect('ETag', 'W/"1"')
          .expect(200, {
            "ads_endpoint": "/devads"
          }, done);
      });
    });

    /*
      HTTP/1.1 GET /config/ios/267
      If-None-Match: W/"1"

      HTTP/1.1 304 Not Modified
      */
    describe('GET /config/ios/267', () => {
      it('returns 304', (done) => {
        request(server)
          .get('/config/ios/267')
          .set('If-None-Match', 'W/"1"')
          .expect(304, done);
      });
    });

    /*
      HTTP/1.1 GET /config/ios/266

      HTTP/1.1 304 Not Modified
      */

    describe('GET /config/ios/266', () => {
      it('returns 304', (done) => {
        request(server)
          .get('/config/ios/266')
          .expect(304, done);
      });
    });

    /*
      HTTP/1.1 GET /config/ios/268

      HTTP/1.1 304 Not Modified
      */

    describe('GET /config/ios/268', () => {
      it('returns 304', (done) => {
        request(server)
          .get('/config/ios/268')
          .expect(304, done);
      });
    });

    /*
      HTTP/1.1 GET /config/android/267

      HTTP/1.1 304 Not Modified
    */

    describe('GET /config/android/267', () => {
      it('returns 304', (done) => {
        request(server)
          .get('/config/android/267')
          .expect(304, done);
      });
    });

    /*
      HTTP/1.1 POST /config
      { "client": "ios", "version": "267", "key": "background_color", "value": "#000" }

      HTTP/1.1 201 Created
    */

    describe('POST /config', () => {
      it('returns 201', (done) => {
        request(server)
          .post('/config')
          .set('Content-Type','application/json')
          .send({ "client": "ios",
                  "version": "267",
                  "key": "background_color",
                  "value": "#000" })
          .expect(201, done);
      });
    });

    /*
      HTTP/1.1 GET /config/ios/267

      HTTP/1.1 200 OK
      Etag: W/"2"
      { "ads_endpoint": "/devads", "background_color": "#000" }
     */

    describe('GET /config/ios/267', () => {
      it('returns 200 with ETag and config data', (done) => {
        request(server)
          .get('/config/ios/267')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect('ETag', 'W/"2"')
          .expect(200, {
            "ads_endpoint": "/devads",
            "background_color": "#000"
          }, done);
      });
    });

    /*
      HTTP/1.1 GET /config/ios/267
      If-None-Match: W/"1"

      HTTP/1.1 200 OK
      ETag: W/"2"
      { "background_color": "#000" }
      */

    describe('GET /config/ios/267', () => {
      it('returns 304', (done) => {
        request(server)
          .get('/config/ios/267')
          .set('If-None-Match', 'W/"1"')
          .expect(200, {
            "background_color": "#000"
          }, done);
      });
    });

    /*
      HTTP/1.1 GET /config/ios/267
      If-None-Match: W/"2"

      HTTP/1.1 304 Not Modified
    */

    describe('GET /config/ios/267', () => {
      it('returns 304', (done) => {
        request(server)
          .get('/config/android/267')
          .set('If-None-Match', 'W/"2"')
          .expect(304, done);
      });
    });
  });
});
