const Optional = require("./optional.js").Optional;
const maps = new WeakMap();
const sizes = new WeakMap();
const capacities = new WeakMap();
const oldests = new WeakMap();
const newests = new WeakMap();

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
    capacities.set(this, checkValue(capacity, "capacity"));
    sizes.set(this, 0);
    maps.set(this, new Map());
    oldests.set(this, null);
    newests.set(this, null);
  }

  put(key, value) {
    checkValue(key, "key");
    checkValue(value, "value");

    this.remove(key);

    const newNode = new Node(key, value);
    maps.get(this).set(key, newNode);
    this.makeUnlinkedNodeNewest(newNode);
    sizes.set(this, sizes.get(this) + 1);

    if (sizes.get(this) > capacities.get(this)) {
      this.remove(oldests.get(this).key);
    }
  }

  get(key) {
    checkValue(key, "key");
    const nodeMaybe = Optional.of(maps.get(this).get(key));
    nodeMaybe.ifPresent((node) => this.onAccess(node));
    return nodeMaybe.map((node) => {
      return node.value;
    });
  }

  remove(key) {
    checkValue(key, "key");
    const nodeMaybe = Optional.of(maps.get(this).get(key));
    nodeMaybe.ifPresent(node => {
      maps.get(this).delete(key);
      sizes.set(this, sizes.get(this) - 1);
      this.unlink(node);
    });
    return nodeMaybe.isPresent();
  }

  clear() {
    maps.get(this).clear();
    sizes.set(this, 0);
    newests.set(this, null);
    oldests.set(this, null);
  }

  size() {
    return sizes.get(this);
  }

  unlink(node) {
    if (node.older !== null) {
      node.older.newer = node.newer;
    }

    if (node.newer !== null) {
      node.newer.older = node.older;
    }

    if (node === newests.get(this)) {
      newests.set(this, node.older);
    }

    if (node === oldests.get(this)) {
      oldests.set(this, node.newer);
    }
  }

  makeUnlinkedNodeNewest(node) {
    if (newests.get(this) !== null) {
      node.older = newests.get(this);
      newests.get(this).newer = node;
    }
    
    newests.set(this, node);

    if (oldests.get(this) === null) {
      oldests.set(this, node);
    }
  }

  onAccess(node) {
    if (node === newests.get(this)) {
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
