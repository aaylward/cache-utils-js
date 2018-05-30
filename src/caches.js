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

function unlink(node, cache) {
  if (node.older !== null) {
    node.older.newer = node.newer;
  }

  if (node.newer !== null) {
    node.newer.older = node.older;
  }

  if (node === newests.get(cache)) {
    newests.set(cache, node.older);
  }

  if (node === oldests.get(cache)) {
    oldests.set(cache, node.newer);
  }
}

function makeUnlinkedNodeNewest(node, cache) {
  if (newests.get(cache) !== null) {
    node.older = newests.get(cache);
    newests.get(cache).newer = node;
  }
  
  newests.set(cache, node);

  if (oldests.get(cache) === null) {
    oldests.set(cache, node);
  }
}

function onAccess(node, cache) {
  if (node === newests.get(cache)) {
    return;
  }

  unlink(node, cache);
  makeUnlinkedNodeNewest(node, cache);
}

class LruCache {
  constructor(capacity) {
    capacities.set(this, checkValue(capacity, "capacity"));
    sizes.set(this, 0);
    maps.set(this, new Map());
    oldests.set(this, null);
    newests.set(this, null);

    this.put = this.put.bind(this);
    this.get = this.get.bind(this);
    this.remove = this.remove.bind(this);
    this.clear = this.clear.bind(this);
  }

  put(key, value) {
    checkValue(key, "key");
    checkValue(value, "value");

    this.remove(key);

    const newNode = new Node(key, value);
    maps.get(this).set(key, newNode);
    makeUnlinkedNodeNewest(newNode, this);
    sizes.set(this, sizes.get(this) + 1);

    if (sizes.get(this) > capacities.get(this)) {
      this.remove(oldests.get(this).key);
    }
  }

  get(key) {
    checkValue(key, "key");
    const nodeMaybe = Optional.of(maps.get(this).get(key));
    nodeMaybe.ifPresent((node) => onAccess(node, this));
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
      unlink(node, this);
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

  toJsObject() {
    const obj = {};
    for (const key of maps.get(this).keys()) {
      obj[key] = maps.get(this).get(key).value;
    }
    return obj;
  }

  toJson() {
    return JSON.stringify(this.toJsObject());
  }
}

function newLruCache(capacity) {
  return new LruCache(capacity);
}

module.exports = { newLruCache };
