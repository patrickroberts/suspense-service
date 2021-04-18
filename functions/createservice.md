[suspense-service](../README.md) / [Exports](../modules.md) / createService

# Function: createService

▸ **createService**<TRequest, TResponse\>(`handler`: [*Handler*](../types/handler.md)<TRequest, TResponse\>): [*Service*](../interfaces/service.md)<TRequest, TResponse\>

Creates a Service Context for providing asynchronous data

#### Type parameters:

| Name |
| :------ |
| `TRequest` |
| `TResponse` |

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `handler` | [*Handler*](../types/handler.md)<TRequest, TResponse\> | the asynchronous function for fetching data    |

**Returns:** [*Service*](../interfaces/service.md)<TRequest, TResponse\>

Defined in: [Service/index.ts:33](https://github.com/patrickroberts/suspense-service/blob/master/src/Service/index.ts#L33)
