[suspense-service](../README.md) / [Exports](../modules.md) / StateContextProviderProps

# Interface: StateContextProviderProps<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [children](statecontextproviderprops.md#children)
- [id](statecontextproviderprops.md#id)
- [reset](statecontextproviderprops.md#reset)
- [value](statecontextproviderprops.md#value)

## Properties

### children

• `Optional` **children**: ReactNode

**`default`** null

Defined in: [StateContext/Provider/Props.ts:18](https://github.com/patrickroberts/suspense-service/blob/master/src/StateContext/Provider/Props.ts#L18)

___

### id

• `Optional` **id**: [*Id*](../types/id.md)

The key that identifies the [StateContextProvider](../types/statecontextprovider.md) to be consumed

**`default`** null

Defined in: [StateContext/Provider/Props.ts:14](https://github.com/patrickroberts/suspense-service/blob/master/src/StateContext/Provider/Props.ts#L14)

___

### reset

• `Optional` **reset**: [*Reset*](../types/reset.md)<T\>

The reset function when {@link StateProviderProps.value | value} updates

Defined in: [StateContext/Provider/Props.ts:22](https://github.com/patrickroberts/suspense-service/blob/master/src/StateContext/Provider/Props.ts#L22)

___

### value

• **value**: T

The initial value to provide

Defined in: [StateContext/Provider/Props.ts:9](https://github.com/patrickroberts/suspense-service/blob/master/src/StateContext/Provider/Props.ts#L9)
