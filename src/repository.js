const repository = {
  getList: (filter) => {
    console.log('[repository] getList');
    const [key, value] = Object.entries(filter)[0];
    const data = window.localStorage.getItem('data');
    if (!data) {
      return [];
    }
    const list = JSON.parse(data);
    const result = list.filter(x => x[key] === value);
    return result;
  },

  _nextId: () => {
    console.log('[repository] _nextId');
    const data = window.localStorage.getItem('data');
    if (!data) {
      return 1;
    }
    const list = JSON.parse(data);
    const maxId = Math.max(...list.map(x => x.id));
    return maxId + 1;
  },

  add: (item) => {
    console.log('[repository] add');
    item.id = repository._nextId();
    item.rootId = item.rootId || item.id;
    const data = window.localStorage.getItem('data');
    const list = data ? JSON.parse(data) : [];
    list.push(item);
    window.localStorage.setItem('data', JSON.stringify(list));
    return item;
  },

  delete: (id) => {
    console.log('[repository] delete');
    const data = window.localStorage.getItem('data');
    const list = JSON.parse(data);
    repository._setDeleted(id, list);
    for (let i = 0; i < list.length;) {
      if (list[i].deleted) {
        list.splice(i, 1);
      } else {
        i++;
      }
    }
    window.localStorage.setItem('data', JSON.stringify(list));
  },

  _setDeleted: (id, list) => {
    console.log('[repository] _setDeleted');
    list.forEach(x => {
      if (x.id === id) {
        x.deleted = true;
      }
      if (x.parentId === id) {
        repository._setDeleted(x.id, list);
      }
    });
  },

  update: (id, item) => {
    console.log('[repository] update');
    const data = window.localStorage.getItem('data');
    const list = JSON.parse(data);
    const currentItem = list.find(x => x.id === id);
    Object.entries(item).forEach(([key, value]) => {
      currentItem[key] = value;
    });
    window.localStorage.setItem('data', JSON.stringify(list));
    return item;
  },

  save: (item) => {
    console.log('[repository] save');
    if (item.id) {
      return repository.update(item.id, item);
    }
    return repository.add(item);
  },

  getItem: (id) => {
    console.log('[repository] getItem');
    const data = window.localStorage.getItem('data');
    if (!data) {
      return null;
    }
    const list = JSON.parse(data);
    return list.find(x => x.id === id);
  },
};

export default repository;
