import Status from './Status';

/** @ignore */
interface PromiseStatePending<TResponse> {
  promise: Promise<TResponse>;
  status: Status.Pending;
}

/** @ignore */
interface PromiseStateFulfilled<TResponse> {
  value: TResponse;
  status: Status.Fulfilled;
}

/** @ignore */
interface PromiseStateRejected {
  reason: any;
  status: Status.Rejected;
}

/** @ignore */
type PromiseState<TResponse> =
  PromiseStatePending<TResponse> |
  PromiseStateFulfilled<TResponse> |
  PromiseStateRejected;

export default PromiseState;
