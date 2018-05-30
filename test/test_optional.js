import test from 'ava';
import { Optional } from '../src/optional.js';

test('optional get on empty throws error', t => {
  t.throws(() => Optional.empty().get(), "no value");
});

test('optional of null is empty', t => {
  const ofNull = Optional.of(null);
  t.false(ofNull.isPresent());
  t.throws(() => { ofNull.get() }, "no value");
});

test('optional of undefined is empty', t => {
  const ofUndefined = Optional.of(undefined);
  t.false(ofUndefined.isPresent());
  t.throws(() => { ofUndefined.get() }, "no value");
});

test('optional of 0 is present', t => {
  const ofZero = Optional.of(0);
  t.true(ofZero.isPresent());
  t.is(ofZero.get(), 0);
});

test('optional of false is present', t => {
  const ofFalse = Optional.of(false);
  t.true(ofFalse.isPresent());
  t.is(ofFalse.get(), false);
});

test('optional of object is present', t => {
  const object = { hey: "sup" };
  const ofObject = Optional.of(object);
  t.true(ofObject.isPresent());
  t.is(ofObject.get(), object);
});

test('map of empty is empty', t => {
  const empty = Optional.empty();
  t.false(empty.isPresent());
  t.false(empty.map((i) => i).isPresent());
});

test('map of present is present if image is not null or undefined', t => {
  const maybe = Optional.of(1);
  const maybeTwo = maybe.map((i) => i * 2);
  t.true(maybeTwo.isPresent());
  t.is(maybeTwo.get(), 2);
});

test('map of present is empty if image is null or undefined', t => {
  const maybe = Optional.of(1);
  const maybeTwo = maybe.map((i) => undefined);
  t.false(maybeTwo.isPresent());
});

test('ifPresent runs if present', t => {
  let ran = false;
  Optional.of(1).ifPresent((i) => ran = true);
  t.true(ran);
});

test('ifPresent does not run if empty', t => {
  let ran = false;
  Optional.empty().ifPresent((i) => ran = true);
  t.false(ran);
});

test('filter returns empty if optional is empty', t => {
  const filtered = Optional.empty().filter((i) => true);
  t.false(filtered.isPresent());
});

test('filter returns present if optional is present and function returns true', t => {
  const filtered = Optional.of(123).filter((i) => true);
  t.true(filtered.isPresent());
  t.is(filtered.get(), 123);
});

test('filter returns empty if optional is present and function returns false', t => {
  const filtered = Optional.of(123).filter((i) => false);
  t.false(filtered.isPresent());
});
