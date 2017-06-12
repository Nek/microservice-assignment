const should = require('should');
const model = require('../../../api/models/config');

describe('config model', () => {
  beforeEach(() => {
    model.reset().catch(err => {});
  });
  describe('find', () => {
    describe('missing config', () => {
      it('returns Promise(undefined) for missing configuration', (done) => {
        model.find({ client: 'ios', version: 123 })
          .then(record => {
            should.not.exist(record);
            done();
          });
      });
    });
    describe('existing config', () => {
      it('returns Promise(record)', (done) => {
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
    describe('updated config', () => {
      it('returns Promise(record) with updated data', (done) => {
        const input1 = { client: "ios", version: 123, key: 'color', value: 'red' };
        const input2 = { client: "ios", version: 123, key: 'color', value: 'blue' };
        const input3 = { client: "ios", version: 123, key: 'size', value: 'XL' };
        model.upsert(input1)
          .then(record => {
            record.should.have.properties({
              client: 'ios',
              version: 123,
              color: 'red'
            });
            return record;
          })
          .then(()=> model.upsert(input2))
          .then(record => {
            record.should.have.properties({
              client: 'ios',
              version: 123,
              color: 'blue'
            });
            return record;
          })
          .then(()=> model.upsert(input3))
          .then(record => {
            record.should.have.properties({
              client: 'ios',
              version: 123,
              color: 'blue',
              size: 'XL'
            });
            done();
          })
          .catch(() => done());
      });
    });
  });
  describe('upsert', () => {
    it('returns new Promise(record)', (done) => {
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
    it('returns updated Promise(record) for existing config', (done) => {
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
  describe.skip('upsert and find', () => {
    it('finds created configuration by client and version', (done) => {
      const p = model.upsert({ client: "ios", version: 123, key: 'color', value: 'red' })
            .then(id => Promise.all([model.find({ client: "ios", version: 123 }), id]))
            .then(v => {
              const [ config, id ] = v;
              config.id.should.be.equal(id);
              return;
            });
      p.should.be.fulfilled().then(done).catch(done);
    });
  });
});
