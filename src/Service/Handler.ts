import Id from '../Context/Id';

/**
 * The type of asynchronous function for fetching data
 */
type Handler<TRequest, TResponse> = (request: TRequest, id: Id) => PromiseLike<TResponse>;

export default Handler;
