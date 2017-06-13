const should = require('should');
const model = require('../../../api/models/configuration');

describe('config model', () => {
  beforeEach((done) => {
    model.reset().then(() => done()).catch(err => done());
  });
  describe('find', () => {
    describe('missing configurations object', () => {
      it('resolves with undefined', (done) => {
        model.find({ client: 'ios', version: '123' })
          .then(record => {
            should.not.exist(record);
            done();
          });
      });
    });
  });
  describe('upsert', () => {
    describe('first configuration', () => {
      it('resolves with configuration object with default etag value', (done) => {
        model.upsert({ client: 'ios',
                       version: '123',
                       key: 'color',
                       value: 'red' })
          .then(record => {
            record.should.have.properties({ client: 'ios',
                                            version: '123',
                                            key: 'color',
                                            value: 'red',
                                            etag: 1
                                          });
            return;
          })
          .then(done)
          .catch(error => {
            done(new Error(error));
          });
      });
    });
    describe('existing configuration with new value', () => {
      it('resolves with configuration object with updated value and etag', (done) => {
        model.upsert({ client: 'ios',
                       version: '123',
                       key: 'color',
                       value: 'red' })
          .then(() => model.upsert( { client: 'ios',
                                      version: '123',
                                      key: 'color',
                                      value: 'green' } ))
          .then(record => {
            record.should.have.properties({ client: 'ios',
                                            version: '123',
                                            key: 'color',
                                            value: 'green',
                                            etag: 2});
            return;
          })
          .then(done)
          .catch(error => {
            done(new Error(error));
          });
      });
    });
    describe('new configuration for configured client and version', () => {
      it('resolves with configuration object with next etag value', (done) => {
        model.upsert({ client: 'ios',
                       version: '123',
                       key: 'color',
                       value: 'red' })
          .then(() => model.upsert({ client: 'ios',
                                     version: '123',
                                     key: 'size',
                                     value: 'XL' }))
          .then(record => {
            record.should.have.properties({ client: 'ios',
                                            version: '123',
                                            key: 'size',
                                            value: 'XL',
                                            etag: 2 });
            return;
          })
          .then(done)
          .catch(error => {
            done(new Error(error));
          });
        });
    });
  });
  describe('upsert and find', () => {
    describe('without etag', () => {
      it('resolves with all configurations object with etag of the latest configuration', (done) => {
        model.upsert({ client: 'ios',
                       version: '123',
                       key: 'color',
                       value: 'red' })
          .then(()=> model.find({ client: 'ios',
                                  version: '123' }))
          .then(record => {
            record.should.have.properties({
              color: 'red',
              etag: 1
            });
            return;
          })
          .then(() => model.upsert({
            client: 'ios',
            version: '123',
            key: 'color',
            value: 'red' }))
          .then(()=> model.find({ client: 'ios',
                                  version: '123' }))
          .then(record => {
            record.should.have.properties({
              color: 'red',
              etag: 2
            });
            return;
          })
          .then(() => model.upsert({
            client: 'ios',
            version: '123',
            key: 'size',
            value: 'XL' }))
          .then(()=> model.find({
            client: 'ios',
            version: '123' }))
          .then(record => {
            record.should.have.properties({
              color: 'red',
              size: 'XL',
              etag: 3
            });
            return;
          })
          .then(done)
          .catch(error => {
            done(new Error(error));
          });
      });
    });
    describe('with etag equal to the latest configuration etag', () => {
      it('resolves with undefined', (done) => {
        model.upsert({ client: 'ios',
                       version: '123',
                       key: 'color',
                       value: 'red' })
          .then(()=> model.find({ client: 'ios',
                                  version: '123',
                                  etag: 1 }))
          .then(record => {
            should.not.exist(record);
            return;
          })
          .then(done)
          .catch(error => {
            done(new Error(error));
          });
      });
    });
    describe('with etag not equal to the latest etag', () => {
      it('resolves with configurations object with configurations since given etag', (done) => {
        model.upsert({
          client: 'ios',
          version: '123',
          key: 'color',
          value: 'red' })
          .then(() => model.upsert({ client: 'ios',
                                     version: '123',
                                     key: 'size',
                                     value: 'XL' }))
          .then(()=> model.find({ client: 'ios',
                                  version: '123',
                                  etag: 1 }))
          .then(record => {
            record.should.have.properties({
              size: 'XL',
              etag: 2
            });
            return;
          })
          .then(done)
          .catch(error => {
            done(new Error(error));
          });
      });
    });
  });
});
