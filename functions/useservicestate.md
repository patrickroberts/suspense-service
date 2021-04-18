[suspense-service](../README.md) / [Exports](../modules.md) / useServiceState

# Function: useServiceState

▸ **useServiceState**<TRequest, TResponse\>(`service`: [*Service*](../interfaces/service.md)<TRequest, TResponse\>, `id?`: [*Id*](../types/id.md)): [TResponse, *Dispatch*<SetStateAction<TRequest\>\>]

Synchronously consumes a stateful response from a [ServiceProvider](../types/serviceprovider.md)

#### Type parameters:

| Name |
| :------ |
| `TRequest` |
| `TResponse` |

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `service` | [*Service*](../interfaces/service.md)<TRequest, TResponse\> | the [Service](../interfaces/service.md) to use   |
| `id?` | [*Id*](../types/id.md) | the [ServiceProvider id](../interfaces/serviceproviderprops.md#id) to use    |

**Returns:** [TResponse, *Dispatch*<SetStateAction<TRequest\>\>]

Defined in: [Service/index.ts:52](https://github.com/patrickroberts/suspense-service/blob/master/src/Service/index.ts#L52)
