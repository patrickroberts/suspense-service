import { DependencyList, useRef } from 'react';
import is from './is';

/**
 * @ignore
 * An alternative to React useMemo that provides a semantic guarantee of referential stability.
 * @param factory The factory function to compute a referentially stable value
 * @param deps The dependencies of the computation
 */
export default function useSync<T>(factory: () => T, deps: DependencyList | undefined): T {
  const { current } = useRef<[T?, DependencyList?]>([]);

  if (!is(current[1], deps)) {
    current[0] = factory();
    current[1] = deps;
  }

  return current[0]!;
}
