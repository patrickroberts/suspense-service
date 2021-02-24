import React from 'react';

/** @ignore */
const enum ResetReducerProperty {
  Reducer,
  InitialState,
  State,
  Dispatch,
}

/** @ignore */
interface ResetReducer<R extends React.Reducer<any, any>> {
  [ResetReducerProperty.Reducer]: R;
  [ResetReducerProperty.InitialState]: React.ReducerState<R>;
  [ResetReducerProperty.State]: React.ReducerState<R>;
  [ResetReducerProperty.Dispatch]: React.Dispatch<React.ReducerAction<R>>;
}

export { ResetReducer as default, ResetReducerProperty };
