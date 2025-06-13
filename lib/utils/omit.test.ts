import { describe, expect, it } from 'vitest';
import { omit } from './omit';

describe('omit', () => {
  it('should omit the specified keys from the object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omit(obj, 'a', 'c');
    expect(result).toEqual({ b: 2 });
  });

  it('should return the original object if no keys are specified', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omit(obj);
    expect(result).toEqual(obj);
  });

  it('should return an empty object if all keys are specified', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omit(obj, 'a', 'b', 'c');
    expect(result).toEqual({});
  });
});
