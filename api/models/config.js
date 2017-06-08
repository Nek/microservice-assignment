const storage = new Map();
let counter = 0;

module.exports = {
  find: ({ client, version }) => {
    const config = storage.get(client + version);
    return Promise.resolve(config);
  },
  create: ({ client, version, key, value }) => {
    const id = counter ++;
    storage.set( client + version , { key, value, id: id.toString() });
    return Promise.resolve(id.toString());
  },
  reset: () => {
    storage.clear();
    counter = 0;
  }
};
