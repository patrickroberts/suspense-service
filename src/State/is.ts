import { DependencyList } from 'react';

/** @ignore */
export default function is(a: DependencyList | undefined, b: DependencyList | undefined): boolean {
  if (!a || !b || a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (!Object.is(a[i], b[i])) return false;
  }

  return true;
}
