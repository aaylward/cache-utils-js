function nullShortCircuit(value, fn) {
  if (value === null) {
    return value;
  }
  return fn.call(null, value);
}

class Optional {
  constructor(value) {
    this.present = value !== null && value !== undefined;
    this.value = value;
  }

  isPresent() {
    return this.present;
  }

  ifPresent(consumer) {
    if (this.isPresent()) {
      consumer.call(null, this.value);
    }
  }

  map(fn) {
    return Optional.of(nullShortCircuit(this.value, fn));
  }

  get() {
    if (!this.isPresent()) {
      throw new Error("no value");
    }
    return this.value;
  }

  static of(value) {
    return new Optional(value);
  }

  static empty() {
    return Optional.of(null);
  }
}

module.exports = {Optional};
