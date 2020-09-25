import React from 'react';
import { DataTable, Given } from '@cucumber/cucumber';
import World from '../world';
import { Context } from '../../..';

Given(
  'I declare a {string} consumer named {string} with the props',
  function (this: World, contextName: string, consumerName: string, dataTable: DataTable) {
    const Context: Context<string> = this.get(contextName);
    const props = this.parseProps(dataTable);
    
    this.set(consumerName, <Context.Consumer {...props} />);
  }
);

Given(
  'I declare a {string} provider named {string} with the props',
  function (this: World, contextName: string, providerName: string, dataTable: DataTable) {
    const Context: Context<string> = this.get(contextName);
    const props = this.parseProps(dataTable);

    this.set(providerName, <Context.Provider {...props} />);
  }
);

Given(
  'I declare a {string} element named {string} with the props',
  function (this: World, componentName: string, elementName: string, dataTable: DataTable) {
    const Component: React.ComponentType = this.get(componentName);
    const props = this.parseProps(dataTable);

    this.set(elementName, <Component {...props} />);
  }
);

Given(
  'I declare a {string} element named {string} without props',
  function (this: World, componentName: string, elementName: string) {
    const Component: React.ComponentType = this.get(componentName);

    this.set(elementName, <Component />);
  }
);
