import Id from './Id';

/** @internal */
export default interface Environment<T> {
  has (key: Id): boolean;
  get (key: Id): T | undefined;
  [Symbol.iterator] (): IterableIterator<[Id, T]>;
}

/** @ignore */
export function wrap<T>(
  env: Environment<T>,
  value: T,
  id: Id = null,
): Environment<T> {
  return new Map(env).set(id, value).set(null, value);
}

/** @ignore */
export function unwrap<T>(
  env: Environment<T>,
  id: Id = null,
): T {
  if (!env.has(id)) {
    throw new Error(`Provider with id ${String(id)} is not in scope`);
  }

  return env.get(id)!;
}
