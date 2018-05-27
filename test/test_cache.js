import test from 'ava';
import { newLruCache } from '../src/caches.js';

test('you can retrieve items you\'ve stored', t => {
  const cache = newLruCache(1);
  cache.put("a", 1);

  const present = cache.get("a");
  t.true(present.isPresent());
  t.is(present.get(), 1);

  const removedA = cache.remove("a");
  t.true(removedA);
  t.false(cache.get("a").isPresent());
});

test('lru cache evicts oldest item', t => {
  const cache = newLruCache(4);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);
  cache.put("d", 4);

  t.true(cache.remove("a"));

  cache.put("e", 5);
  cache.put("f", 6);

  t.false(cache.remove("b"));
});
