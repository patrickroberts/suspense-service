import { DataTable, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import React, { Fragment, isValidElement } from 'react';

const array = /^\[(.*)\]$/;
const literal = /^(".*"|null)$/;

export default class World extends Map<string, any> implements IWorldOptions {
  attach: IWorldOptions['attach'];

  log: IWorldOptions['log'];

  parameters: IWorldOptions['parameters'];

  output?: string;

  constructor({ attach, log, parameters }: IWorldOptions) {
    super();

    this.attach = attach;
    this.log = log;
    this.parameters = parameters;
  }

  parseProps(dataTable: DataTable): any {
    const entries = dataTable.raw();

    return entries.map(
      ([key, token]) => [key, this.parse(token)],
    ).reduce(
      (props, [key, value]) => Object.assign(props, { [key]: value }),
      {},
    );
  }

  private parse(token: string, key?: number): any {
    const arrayMatch = token.match(array);

    if (arrayMatch !== null) {
      return arrayMatch[1].split(',').map(
        (value, index) => this.parse(value.trim(), index),
      );
    }

    if (literal.test(token)) {
      return JSON.parse(token);
    }

    if (this.has(token)) {
      const value = this.get(token);

      if (key !== undefined && isValidElement(value)) {
        return <Fragment key={key}>{value}</Fragment>;
      }

      return value;
    }

    throw new ReferenceError(`${token} is not defined`);
  }
}

setWorldConstructor(World);
