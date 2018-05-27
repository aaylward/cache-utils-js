import test from 'ava';
import Optional from '../src/optional.js';

test('optional of null is empty', t => {
  t.truthy(Optional.of(null).isPresent());
});

