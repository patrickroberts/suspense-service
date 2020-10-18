/** @ignore */
interface PromiseStatePending {
  promise: Promise<void>;
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
  PromiseStatePending |
  PromiseStateFulfilled<TResponse> |
  PromiseStateRejected;

export default PromiseState;
