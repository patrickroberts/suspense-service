import React from 'react';
import { Given } from '@cucumber/cucumber';
import World from '../world';
import { Context, createContext, useContext } from '../../../src';

const createComponent = (Context: Context<string>, Element: keyof JSX.IntrinsicElements) => (
  (props: { id?: string | null }) => {
    const value = useContext(Context, props.id);

    return (
      <Element>{value}</Element>
    );
  }
);

const createFunction = (Element: keyof JSX.IntrinsicElements) => (
  (value: string) => (
    <Element>{value}</Element>
  )
);

Given(
  'a context named {string} with the default value {string}',
  function (this: World, contextName: string, defaultValue: string) {
    this.set(contextName, createContext(defaultValue));
  }
);

Given(
  'a component named {string} using the context {string} and returning a {string}',
  function (this: World, componentName: string, contextName: string, Element: keyof JSX.IntrinsicElements) {
    this.set(componentName, createComponent(this.get(contextName), Element));
  }
);

Given(
  'a function named {string} returning a {string}',
  function (this: World, functionName: string, Element: keyof JSX.IntrinsicElements) {
    this.set(functionName, createFunction(Element));
  }
);
