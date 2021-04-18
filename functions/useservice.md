[suspense-service](../README.md) / [Exports](../modules.md) / useService

# Function: useService

▸ **useService**<TResponse\>(`service`: [*Service*](../interfaces/service.md)<any, TResponse\>, `id?`: [*Id*](../types/id.md)): TResponse

Synchronously consumes a response from a [ServiceProvider](../types/serviceprovider.md)

#### Type parameters:

| Name |
| :------ |
| `TResponse` |

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `service` | [*Service*](../interfaces/service.md)<any, TResponse\> | the [Service](../interfaces/service.md) to use   |
| `id?` | [*Id*](../types/id.md) | the [ServiceProvider id](../interfaces/serviceproviderprops.md#id) to use    |

**Returns:** TResponse

Defined in: [Service/index.ts:65](https://github.com/patrickroberts/suspense-service/blob/master/src/Service/index.ts#L65)
