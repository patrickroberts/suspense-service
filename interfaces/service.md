[suspense-service](../README.md) / [Exports](../modules.md) / Service

# Interface: Service<TRequest, TResponse\>

A Suspense integration for providing asynchronous data through a Context API

## Type parameters

| Name |
| :------ |
| `TRequest` |
| `TResponse` |

## Table of contents

### Properties

- [Consumer](service.md#consumer)
- [Provider](service.md#provider)
- [[kResource]](service.md#[kresource])

## Properties

### Consumer

• **Consumer**: [*ServiceConsumer*](../types/serviceconsumer.md)<TRequest, TResponse\>

Defined in: [Service/index.ts:18](https://github.com/patrickroberts/suspense-service/blob/master/src/Service/index.ts#L18)

___

### Provider

• **Provider**: [*ServiceProvider*](../types/serviceprovider.md)<TRequest\>

Defined in: [Service/index.ts:19](https://github.com/patrickroberts/suspense-service/blob/master/src/Service/index.ts#L19)

___

### [kResource]

• **[kResource]**: [*IdContext*](idcontext.md)<[() => TResponse, *Dispatch*<SetStateAction<TRequest\>\>]\>

**`internal`** 

Defined in: [Service/index.ts:21](https://github.com/patrickroberts/suspense-service/blob/master/src/Service/index.ts#L21)
