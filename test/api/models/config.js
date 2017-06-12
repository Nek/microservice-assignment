const should = require('should');
const model = require('../../../api/models/config');

describe('config model', () => {
  beforeEach(() => {
    model.reset().catch(err => {});
  });
  describe('find', () => {
    describe('missing config', () => {
      it('resolves with undefined for missing configuration', (done) => {
        model.find({ client: 'ios', version: 123 })
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
        const input = { client: "ios", version: 123, key: 'color', value: 'red' };
        model.upsert(input)
          .then(record => {
            record.should.have.properties({ client: "ios",
                                            version: 123,
                                            color: 'red'
                                          });
            done();
          })
          .catch(() => done());
      });
    });
    describe('existing config', () => {
      it('resolves with updated config record', (done) => {
        const input = { client: "ios", version: 123, key: 'color', value: 'red' };
        model.upsert(input)
          .then(() => model.upsert( Object.merge(input, { value: 'green' }) ))
          .then(record => {
            record.should.have.properties(Object.merge(input, { color: 'green' }));
            done();
          })
          .catch(() => done());
      });
    });
  });
  describe('upsert and find', () => {
    describe('new config',() => {
      it('resolves with config record', (done) => {
        const input = { client: "ios", version: 123, key: 'color', value: 'red' };
        model.upsert(input)
          .then(()=> model.find({ client: input.client, version: input.version }))
          .then(record => {
            record.should.have.properties({
              client: 'ios',
              version: 123,
              color: 'red'
            });
            done();
          })
          .catch(() => done());
      });
    });
  });
});
