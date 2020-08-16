export default interface Environment<T> {
  has (key: string | null): boolean;
  get (key: string | null): T | undefined;
  [Symbol.iterator] (): IterableIterator<[string | null, T]>;
};

export function wrap<T>(
  env: Environment<T>,
  value: T,
  id: string | null
): Environment<T> {
  return new Map([...env, [id, value], [null, value]]);
}

export function unwrap<T>(
  env: Environment<T>,
  id: string | null
): T {
  if (!env.has(id)) {
    throw new Error(`Provider with id ${id} is not in scope`);
  }

  return env.get(id)!;
}
