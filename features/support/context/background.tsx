import React, { ComponentType } from 'react';
import { Given } from '@cucumber/cucumber';
import World from '../world';
import { Context, createContext, useContext } from '../../..';

interface ComponentProps {
  id?: string | null;
}

const createComponent = (context: Context<string>, Element: keyof JSX.IntrinsicElements) => {
  const Component: ComponentType<ComponentProps> = ({ id }: ComponentProps) => {
    const value = useContext(context, id);

    return (
      <Element>{value}</Element>
    );
  };

  Component.defaultProps = {
    id: null,
  };

  return Component;
};

const createFunction = (Element: keyof JSX.IntrinsicElements) => (
  (value: string) => (
    <Element>{value}</Element>
  )
);

Given(
  'a context named {string} with the default value {string}',
  function contextNamedWithDefaultValue(this: World, contextName: string, defaultValue: string) {
    this.set(contextName, createContext(defaultValue));
  },
);

Given(
  'a component named {string} using the context {string} and returning a {string}',
  function componentNamedUsingContextReturning(
    this: World, componentName: string, contextName: string, Element: keyof JSX.IntrinsicElements,
  ) {
    this.set(componentName, createComponent(this.get(contextName), Element));
  },
);

Given(
  'a function named {string} returning a {string}',
  function functionNamedReturning(
    this: World, functionName: string, Element: keyof JSX.IntrinsicElements,
  ) {
    this.set(functionName, createFunction(Element));
  },
);
