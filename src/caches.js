const Optional = require("./optional.js").Optional;

function checkValue(value, message) {
  if (value === null || value === undefined) {
    throw new Error(message);
  }

  return value;
}

class Node {
  constructor(key, value) {
    this.key = checkValue(key, "key");
    this.value = value;
    this.newer = null;
    this.older = null;
  }
}

class LruCache {
  constructor(capacity) {
    this.capacity = checkValue(capacity, "capacity");
    this.size = 0;
    this.map = new Map();
    this.oldest = null;
    this.newest = null;
    
    this.put = this.put.bind(this);
    this.get = this.get.bind(this);
    this.remove = this.remove.bind(this);
    this.clear = this.clear.bind(this);
    this.onAccess = this.onAccess.bind(this);
    this.unlink = this.unlink.bind(this);
    this.makeUnlinkedNodeNewest = this.makeUnlinkedNodeNewest.bind(this);
  }

  put(key, value) {
    checkValue(key, "key");
    checkValue(value, "value");

    this.remove(key);

    const newNode = new Node(key, value);
    this.map.set(key, newNode);
    this.makeUnlinkedNodeNewest(newNode);
    this.size++;

    if (this.size > this.capacity) {
      this.remove(this.oldest.key);
    }
  }

  get(key) {
    checkValue(key, "key");
    const nodeMaybe = Optional.of(this.map.get(key));
    nodeMaybe.ifPresent(this.onAccess);
    return nodeMaybe.map((node) => {
      return node.value;
    });
  }

  remove(key) {
    checkValue(key, "key");
    const nodeMaybe = Optional.of(this.map.get(key));
    nodeMaybe.ifPresent(node => {
      this.map.delete(key);
      this.unlink(node);
      this.size--;
    });
    return nodeMaybe.isPresent();
  }

  clear() {
    this.map.clear();
    this.size = 0;
    this.newest = null;
    this.oldest = null;
  }

  unlink(node) {
    if (node.older !== null) {
      node.older.newer = node.newer;
    }

    if (node.newer !== null) {
      node.newer.older = node.older;
    }

    if (node === this.newest) {
      this.newest = node.older;
    }

    if (node === this.oldest) {
      this.oldest = node.newer;
    }
  }

  makeUnlinkedNodeNewest(node) {
    if (this.newest !== null) {
      node.older = this.newest;
      this.newest.newer = node;
    }
    
    this.newest = node;

    if (this.oldest === null) {
      this.oldest = node;
    }
  }

  onAccess(node) {
    if (node === this.newest) {
      return;
    }

    this.unlink(node);
    this.makeUnlinkedNodeNewest(node);
  }
}

function newLruCache(capacity) {
  return new LruCache(capacity);
}

module.exports = { newLruCache };
