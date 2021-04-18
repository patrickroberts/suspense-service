[suspense-service](../README.md) / [Exports](../modules.md) / StateContext

# Interface: StateContext<T\>

A State Context with support for multiple keyed values

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [Consumer](statecontext.md#consumer)
- [Provider](statecontext.md#provider)
- [[kState]](statecontext.md#[kstate])

## Properties

### Consumer

• **Consumer**: [*StateContextConsumer*](../types/statecontextconsumer.md)<T\>

Defined in: [StateContext/index.ts:17](https://github.com/patrickroberts/suspense-service/blob/master/src/StateContext/index.ts#L17)

___

### Provider

• **Provider**: [*StateContextProvider*](../types/statecontextprovider.md)<T\>

Defined in: [StateContext/index.ts:18](https://github.com/patrickroberts/suspense-service/blob/master/src/StateContext/index.ts#L18)

___

### [kState]

• **[kState]**: [*IdContext*](idcontext.md)<[*State*](../types/state.md)<T\>\>

**`internal`** 

Defined in: [StateContext/index.ts:20](https://github.com/patrickroberts/suspense-service/blob/master/src/StateContext/index.ts#L20)
