/** @internal */
export default interface Resource<TResponse> {
  (): TResponse;
}
