[suspense-service](../README.md) / [Exports](../modules.md) / StateContextConsumerProps

# Interface: StateContextConsumerProps<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [children](statecontextconsumerprops.md#children)
- [id](statecontextconsumerprops.md#id)

## Properties

### children

• **children**: (`value`: T, `setState`: *Dispatch*<SetStateAction<T\>\>) => ReactNode

#### Type declaration:

▸ (`value`: T, `setState`: *Dispatch*<SetStateAction<T\>\>): ReactNode

#### Parameters:

| Name | Type |
| :------ | :------ |
| `value` | T |
| `setState` | *Dispatch*<SetStateAction<T\>\> |

**Returns:** ReactNode

Defined in: [StateContext/Consumer/Props.ts:10](https://github.com/patrickroberts/suspense-service/blob/master/src/StateContext/Consumer/Props.ts#L10)

Defined in: [StateContext/Consumer/Props.ts:10](https://github.com/patrickroberts/suspense-service/blob/master/src/StateContext/Consumer/Props.ts#L10)

___

### id

• `Optional` **id**: [*Id*](../types/id.md)

The {@link StateProvider} to use

**`default`** null

Defined in: [StateContext/Consumer/Props.ts:9](https://github.com/patrickroberts/suspense-service/blob/master/src/StateContext/Consumer/Props.ts#L9)
