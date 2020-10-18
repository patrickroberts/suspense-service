import Id from '../Context/Id';

export default interface Handler<TRequest, TResponse> {
  (request: TRequest, id: Id): PromiseLike<TResponse>;
}
