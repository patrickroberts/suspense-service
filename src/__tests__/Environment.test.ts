import Environment, { wrap, unwrap } from '../Context/Environment';

describe('Environment', () => {
  let env: Environment<number>;

  beforeEach(() => {
    env = new Map([['a', 1], ['b', 2], [null, 2]]);
  });

  describe('wrap(env, value[, id])', () => {
    it('should set null entry when id is null', () => {
      const expected = new Map([['a', 1], ['b', 2], [null, 3]]);

      expect(wrap(env, 3, null)).toEqual(expected);
    });

    it('should set id entry and null entry when id is not present in env', () => {
      const expected = new Map([['a', 1], ['b', 2], [null, 3], ['c', 3]]);

      expect(wrap(env, 3, 'c')).toEqual(expected);
    });

    it('should set id entry and null entry when id is present in env', () => {
      const expected = new Map([['a', 3], ['b', 2], [null, 3]]);

      expect(wrap(env, 3, 'a')).toEqual(expected);
    });

    it('should not mutate input env', () => {
      const expected = new Map(env);

      wrap(env, 3, 'a');

      expect(env).toEqual(expected);
    });
  });

  describe('unwrap(env[, id])', () => {
    it('should return null entry value when id is null', () => {
      expect(unwrap(env, null)).toBe(2);
    });

    it('should return id entry value when id is present in env', () => {
      expect(unwrap(env, 'a')).toBe(1);
    });

    it('should throw when id is not present in env', () => {
      expect(() => unwrap(env, 'c')).toThrow();
    });
  });
});
