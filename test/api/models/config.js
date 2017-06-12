const should = require('should');
const model = require('../../../api/models/config');

describe('config model', () => {
  beforeEach(() => {
    model.reset().catch(err => {});
  });
  describe('find', () => {
    describe('missing config', () => {
      it('resolves with undefined for missing configuration', (done) => {
        model.find({ client: 'ios', version: '123' })
          .then(record => {
            should.not.exist(record);
            done();
          });
      });
    });
  });
  describe('upsert', () => {
    describe('new config', () => {
      it('resolves with new config record', (done) => {
        const input = { client: 'ios', version: '123', key: 'color', value: 'red' };
        model.upsert(input)
          .then(record => {
            record.should.have.properties({ client: 'ios',
                                            version: '123',
                                            color: 'red',
                                            etag: 1
                                          });
            done();
          })
          .catch(error => {
            done(new Error(error));
          });
      });
    });
    describe('existing config', () => {
      describe('with existing property', () => {
        it('resolves with config record with updated property', (done) => {
          model.upsert({ client: 'ios', version: '123', key: 'color', value: 'red' })
            .then(() => model.upsert( { client: 'ios', version: '123', key: 'color', value: 'green' } ))
            .then(record => {
              record.should.have.properties({ client: 'ios', version: '123', color: 'green', etag: 2 });
              done();
            })
            .catch(error => {
              done(new Error(error));
            });
        });
      });
      describe('with new property', () => {
        it('resolves with config record with updated property', (done) => {
          model.upsert({ client: 'ios', version: '123', key: 'color', value: 'red' })
            .then(() => model.upsert({ client: 'ios', version: '123', key: 'size', value: 'XL' }))
            .then(() => model.find({ client: 'ios', version: '123'}))
            .then(record => {
              record.should.have.properties({ client: 'ios', version: '123', color: 'red', size: 'XL' });
              done();
            })
            .catch(error => {
              done(new Error(error));
            });
        });
      });
    });
  });
  describe('upsert and find', () => {
    describe('new config',() => {
      describe('without etag', () => {
        it('resolves with config record', (done) => {
          model.upsert({ client: 'ios', version: '123', key: 'color', value: 'red' })
            .then(()=> model.find({ client: 'ios', version: '123' }))
            .then(record => {
              record.should.have.properties({
                client: 'ios',
                version: '123',
                color: 'red'
              });
              done();
            })
            .catch(error => {
              done(new Error(error));
            });
        });
      });
      describe('with etag', () => {
        it('resolves with config record', (done) => {
          model.upsert({ client: 'ios', version: '123', key: 'color', value: 'red' })
            .then(()=> model.find({ client: 'ios', version: '123', etag: 1 }))
            .then(record => {
              should(record).be.equal(null);
              done();
            })
            .catch(error => {
              done(new Error(error));
            });
        });
      });
    });
  });
});
