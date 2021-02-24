import { DependencyList, useRef } from 'react';
import Sync, { SyncProperty } from './Sync';

const initialValue: Sync<any> = {};

/** @ignore */
function dependencyListIs(a: DependencyList | undefined, b: DependencyList | undefined): boolean {
  if (!a || !b || a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (!Object.is(a[i], b[i])) return false;
  }

  return true;
}

/**
 * @ignore
 * An alternative to React useMemo that provides a semantic guarantee of referential stability.
 * This allows synchronous effects to be invoked safely during the render phase.
 * @param factory The factory function to compute a referentially stable value
 * @param deps The dependencies of the computation
 */
export default function useSync<T>(factory: () => T, deps: DependencyList | undefined): T {
  const ref = useRef<Sync<T>>(initialValue);

  if (!dependencyListIs(ref.current[SyncProperty.Deps], deps)) {
    ref.current = [factory(), deps];
  }

  return ref.current[SyncProperty.State]!;
}
