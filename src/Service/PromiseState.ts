/** @ignore */
const enum PromiseStateProperty {
  Status,
  Result,
}

export { PromiseStateProperty };

/** @ignore */
const enum StatusType {
  Pending,
  Fulfilled,
  Rejected,
}

export { StatusType };

/** @ignore */
interface PromiseStatePending<TResponse> {
  [PromiseStateProperty.Status]: StatusType.Pending;
  [PromiseStateProperty.Result]: Promise<TResponse>;
}

/** @ignore */
interface PromiseStateFulfilled<TResponse> {
  [PromiseStateProperty.Status]: StatusType.Fulfilled;
  [PromiseStateProperty.Result]: TResponse;
}

/** @ignore */
interface PromiseStateRejected {
  [PromiseStateProperty.Status]: StatusType.Rejected;
  [PromiseStateProperty.Result]: any;
}

/** @ignore */
type PromiseState<TResponse> =
  PromiseStatePending<TResponse> |
  PromiseStateFulfilled<TResponse> |
  PromiseStateRejected;

export default PromiseState;
