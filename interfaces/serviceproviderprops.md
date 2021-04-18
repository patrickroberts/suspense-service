[suspense-service](../README.md) / [Exports](../modules.md) / ServiceProviderProps

# Interface: ServiceProviderProps<TRequest\>

## Type parameters

| Name |
| :------ |
| `TRequest` |

## Table of contents

### Properties

- [children](serviceproviderprops.md#children)
- [fallback](serviceproviderprops.md#fallback)
- [id](serviceproviderprops.md#id)
- [request](serviceproviderprops.md#request)
- [reset](serviceproviderprops.md#reset)

## Properties

### children

• `Optional` **children**: ReactNode

**`default`** null

Defined in: [Service/Provider/Props.ts:18](https://github.com/patrickroberts/suspense-service/blob/master/src/Service/Provider/Props.ts#L18)

___

### fallback

• `Optional` **fallback**: ``null`` \| *boolean* \| ReactChild \| ReactFragment \| *ReactPortal*

The fallback to render if any children are suspended.
If the fallback is `null`, `undefined`, or omitted, then a Suspense
component must be inserted elsewhere between the
[Provider](../types/serviceprovider.md) and [Consumer](../types/serviceconsumer.md).

**`default`** null

Defined in: [Service/Provider/Props.ts:26](https://github.com/patrickroberts/suspense-service/blob/master/src/Service/Provider/Props.ts#L26)

___

### id

• `Optional` **id**: [*Id*](../types/id.md)

The key that identifies the [ServiceProvider](../types/serviceprovider.md) to be consumed

**`default`** null

Defined in: [Service/Provider/Props.ts:14](https://github.com/patrickroberts/suspense-service/blob/master/src/Service/Provider/Props.ts#L14)

___

### request

• **request**: TRequest

The request passed to [handler](../functions/createservice.md) for fetching an asynchronous resource.

Defined in: [Service/Provider/Props.ts:9](https://github.com/patrickroberts/suspense-service/blob/master/src/Service/Provider/Props.ts#L9)

___

### reset

• `Optional` **reset**: [*Reset*](../types/reset.md)<TRequest\>

The reset function when [request](serviceproviderprops.md#request) updates

Defined in: [Service/Provider/Props.ts:30](https://github.com/patrickroberts/suspense-service/blob/master/src/Service/Provider/Props.ts#L30)
