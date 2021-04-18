[suspense-service](../README.md) / [Exports](../modules.md) / useStateContext

# Function: useStateContext

▸ **useStateContext**<T\>(`context`: [*StateContext*](../interfaces/statecontext.md)<T\>, `id?`: [*Id*](../types/id.md)): [*State*](../types/state.md)<T\>

Consumes a stateful value from a [StateContextProvider](../types/statecontextprovider.md), and a function to update it

#### Type parameters:

| Name |
| :------ |
| `T` |

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [*StateContext*](../interfaces/statecontext.md)<T\> | the [StateContext](../interfaces/statecontext.md) to use   |
| `id?` | [*Id*](../types/id.md) | the [StateContextProvider id](../interfaces/statecontextproviderprops.md#id) to use    |

**Returns:** [*State*](../types/state.md)<T\>

Defined in: [StateContext/index.ts:47](https://github.com/patrickroberts/suspense-service/blob/master/src/StateContext/index.ts#L47)
