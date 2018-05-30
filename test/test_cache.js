import test from 'ava';
import { newLruCache } from '../src/caches.js';

test('it can retrieve items you\'ve stored', t => {
  const cache = newLruCache(1);
  cache.put("a", 1);

  const present = cache.get("a");
  t.true(present.isPresent());
  t.is(present.get(), 1);
});

test('it can explicitly remove items you\'ve stored', t => {
  const cache = newLruCache(1);
  cache.put("a", 1);

  t.true(cache.remove("a"));
  t.false(cache.get("a").isPresent());
  t.deepEqual(cache.toJsObject(), {}, "empty cache");
  t.is(cache.size(), 0);
});

test('it evicts the least recently used oldest key', t => {
  const cache = newLruCache(4);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);
  cache.put("d", 4);
  cache.get("a");      // order is now bcda

  cache.put("e", 5);   // b should be gone
  cache.put("f", 6);   // c should be gone

  t.false(cache.remove("b"));
  t.false(cache.remove("c"));
  t.is(cache.size(), 4);
});

test('it can clear cache', t => {
  const cache = newLruCache(4);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);
  cache.put("d", 4);

  t.is(cache.size(), 4);

  cache.clear();

  t.is(cache.size(), 0);
});

test('it can be converted to a regular JS object', t => {
  const cache = newLruCache(4);
  t.deepEqual(cache.toJsObject(), {}, "empty cache");

  cache.put("apples", 42);
  t.deepEqual(cache.toJsObject(), {"apples": 42}, "cache with stuff");
});

test('it stores the last value written for a key', t => {
  const cache = newLruCache(4);

  cache.put("apples", 41);
  t.is(cache.size(), 1);
  cache.put("apples", 42);
  t.is(cache.size(), 1);
  t.deepEqual(cache.toJsObject(), {"apples": 42}, "cache with stuff");
});
