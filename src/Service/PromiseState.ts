/** @ignore */
interface PromiseStatePending<TResponse> {
  promise: Promise<TResponse>;
  status: 'pending';
}

/** @ignore */
interface PromiseStateFulfilled<TResponse> {
  value: TResponse;
  status: 'fulfilled';
}

/** @ignore */
interface PromiseStateRejected {
  reason: any;
  status: 'rejected';
}

/** @ignore */
type PromiseState<TResponse> =
  PromiseStatePending<TResponse> |
  PromiseStateFulfilled<TResponse> |
  PromiseStateRejected;

export default PromiseState;
