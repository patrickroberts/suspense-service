import { DependencyList } from 'react';

/** @ignore */
const enum SyncProperty {
  State,
  Deps,
}

/** @ignore */
interface Sync<T> {
  [SyncProperty.State]?: T;
  [SyncProperty.Deps]?: DependencyList;
}

export { Sync as default, SyncProperty };
