const should = require('should');
const model = require('../../../api/models/config');

describe('config model', () => {
  beforeEach(() => {
    model.reset();
  });
  describe('find', () => {
    describe('existing config', () => {
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
        const input = { client: "ios", version: 123, key: 'color', value: 'red' };
        const updateInput = { client: "ios", version: 123, key: 'color', value: 'blue' };
        model.upsert(input)
          .then(()=> model.find({ client: input.client, version: input.version }))
          .then(()=> model.upsert({ client: input.client,
                                    version: input.version,
                                    color: 'blue'}))
          .then(record => {
            record.should.have.properties(input);
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
