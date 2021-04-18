[suspense-service](../README.md) / [Exports](../modules.md) / ServiceConsumerProps

# Interface: ServiceConsumerProps<TRequest, TResponse\>

## Type parameters

| Name |
| :------ |
| `TRequest` |
| `TResponse` |

## Table of contents

### Properties

- [children](serviceconsumerprops.md#children)
- [id](serviceconsumerprops.md#id)

## Properties

### children

• **children**: (`value`: TResponse, `setState`: *Dispatch*<SetStateAction<TRequest\>\>) => ReactNode

#### Type declaration:

▸ (`value`: TResponse, `setState`: *Dispatch*<SetStateAction<TRequest\>\>): ReactNode

#### Parameters:

| Name | Type |
| :------ | :------ |
| `value` | TResponse |
| `setState` | *Dispatch*<SetStateAction<TRequest\>\> |

**Returns:** ReactNode

Defined in: [Service/Consumer/Props.ts:10](https://github.com/patrickroberts/suspense-service/blob/master/src/Service/Consumer/Props.ts#L10)

Defined in: [Service/Consumer/Props.ts:10](https://github.com/patrickroberts/suspense-service/blob/master/src/Service/Consumer/Props.ts#L10)

___

### id

• `Optional` **id**: [*Id*](../types/id.md)

The [ServiceProvider](../types/serviceprovider.md) to use

**`default`** null

Defined in: [Service/Consumer/Props.ts:9](https://github.com/patrickroberts/suspense-service/blob/master/src/Service/Consumer/Props.ts#L9)
