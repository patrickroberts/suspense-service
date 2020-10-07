import React, { ComponentType } from 'react';
import { DataTable, Given } from '@cucumber/cucumber';
import World from '../world';
import { Context } from '../../..';

Given(
  'I declare a {string} consumer named {string} with the props',
  function declareConsumerNamedWithProps(
    this: World, contextName: string, consumerName: string, dataTable: DataTable,
  ) {
    const { Consumer }: Context<string> = this.get(contextName);
    const props = this.parseProps(dataTable);

    this.set(consumerName, <Consumer {...props} />);
  },
);

Given(
  'I declare a {string} provider named {string} with the props',
  function declareProviderNamedWithProps(
    this: World, contextName: string, providerName: string, dataTable: DataTable,
  ) {
    const { Provider }: Context<string> = this.get(contextName);
    const props = this.parseProps(dataTable);

    this.set(providerName, <Provider {...props} />);
  },
);

Given(
  'I declare a {string} element named {string} with the props',
  function declareElementNamedWithProps(
    this: World, componentName: string, elementName: string, dataTable: DataTable,
  ) {
    const Component: ComponentType = this.get(componentName);
    const props = this.parseProps(dataTable);

    this.set(elementName, <Component {...props} />);
  },
);

Given(
  'I declare a {string} element named {string} without props',
  function declareElementNamedWithoutProps(
    this: World, componentName: string, elementName: string,
  ) {
    const Component: ComponentType = this.get(componentName);

    this.set(elementName, <Component />);
  },
);
