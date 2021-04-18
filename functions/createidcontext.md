[suspense-service](../README.md) / [Exports](../modules.md) / createIdContext

# Function: createIdContext

▸ **createIdContext**<T\>(`defaultValue`: T): [*IdContext*](../interfaces/idcontext.md)<T\>

Creates a keyed Context allowing multiple nested Providers to be accessible in the same scope.

#### Type parameters:

| Name |
| :------ |
| `T` |

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `defaultValue` | T | the value consumed if no [IdContextProvider](../types/idcontextprovider.md) is in scope and the [consumer `id`](../interfaces/idcontextconsumerprops.md#id) is `null`    |

**Returns:** [*IdContext*](../interfaces/idcontext.md)<T\>

Defined in: [IdContext/index.ts:28](https://github.com/patrickroberts/suspense-service/blob/master/src/IdContext/index.ts#L28)
