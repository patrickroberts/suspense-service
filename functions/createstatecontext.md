[suspense-service](../README.md) / [Exports](../modules.md) / createStateContext

# Function: createStateContext

▸ **createStateContext**<T\>(`defaultValue`: T): [*StateContext*](../interfaces/statecontext.md)<T\>

Creates a State Context for providing a stateful value and a function to update it.

#### Type parameters:

| Name |
| :------ |
| `T` |

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `defaultValue` | T | the value consumed if no [StateContextProvider](../types/statecontextprovider.md) is in scope and the [consumer `id`](../interfaces/statecontextconsumerprops.md#id) is `null`    |

**Returns:** [*StateContext*](../interfaces/statecontext.md)<T\>

Defined in: [StateContext/index.ts:30](https://github.com/patrickroberts/suspense-service/blob/master/src/StateContext/index.ts#L30)
