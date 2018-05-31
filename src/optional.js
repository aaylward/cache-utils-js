const presents = new WeakMap();
const values = new WeakMap();

function nullShortCircuit(value, fn) {
  if (value === null || value === undefined) {
    return value ;
  }
  return fn.call(null, value);
}

class Optional {
  constructor(value) {
    presents.set(this, value !== null && value !== undefined);
    values.set(this, value);

    this.isPresent = this.isPresent.bind(this);
    this.ifPresent = this.ifPresent.bind(this);
    this.map = this.map.bind(this);
    this.filter = this.filter.bind(this);
    this.get = this.get.bind(this);
  }

  isPresent() {
    return presents.get(this);
  }

  ifPresent(consumer) {
    if (presents.get(this)) {
      consumer.call(null, values.get(this));
    }
  }

  map(fn) {
    if (this.isPresent()) {
      return Optional.of(fn.call(null, values.get(this)));
    }
    return Optional.empty();
  }

  filter(fn) {
    if (this.isPresent() && fn.call(null, values.get(this))) {
      return this;
    }
    return presents.get(this) ? Optional.empty() : this;
  }

  get() {
    if (!this.isPresent()) {
      throw new Error("no value");
    }
    return values.get(this);
  }

  static of(value) {
    return new Optional(value);
  }

  static empty() {
    return Optional.of(null);
  }
}

module.exports = { Optional };
