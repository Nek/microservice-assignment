const should = require('should');
const model = require('../../../api/models/config');

describe('config model', () => {
  beforeEach(() => {
    model.reset();
  });
  describe('find', () => {
    it('returns Promise(undefined) for missing configuration', (done) => {
      const p = model.find({ client: "ios", version: 123 });
      p.then(v => {
        should.not.exist(v);
        done();
      });
    });
  });
  describe('create', () => {
    it('returns Promise(configurationId)', (done) => {
      p = model.create({ client: "ios", version: 123, key: 'color', value: 'red' })
        .then(v => {
          v.should.be.String();
          done();
        });
    });
  });
  describe('create and find', () => {
    it('finds created configuration by client and version', (done) => {
      const p = model.create({ client: "ios", version: 123, key: 'color', value: 'red' })
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
