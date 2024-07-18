import { isEmpty } from 'lib/utils/array.mjs';

describe('isEmpty', () => {
  it('returns true if array is empty', () => {
    const emptyArray = isEmpty([]);
    expect(emptyArray).toBe(true);
  });

  it('returns true if array items are undefined', () => {
    const isArrayEmpty = isEmpty([undefined]);
    expect(isArrayEmpty).toBe(true);
  });

  it('returns false if valid items', () => {
    const isArrayEmpty = isEmpty([1, 2]);
    expect(isArrayEmpty).toBe(false);
  });
});
