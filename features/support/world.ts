import { DataTable, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';

const array = /^\[(.*)\]$/;
const literal = /^(".*"|null)$/;

export default class World extends Map<string, any> implements IWorldOptions {
  attach: IWorldOptions['attach'];
  log: IWorldOptions['log'];
  parameters: IWorldOptions['parameters'];
  output?: string;

  constructor ({ attach, log, parameters }: IWorldOptions) {
    super();

    this.attach = attach;
    this.log = log;
    this.parameters = parameters;
  }

  parseProps (dataTable: DataTable): any {
    const entries = dataTable.raw();

    return entries.map(
      ([key, token]) => [key, this.parse(token)]
    ).reduce(
      (props, [key, value]) => Object.assign(props, { [key]: value }),
      {}
    );
  }

  private parse (token: string): any {
    const arrayMatch = token.match(array);

    if (arrayMatch !== null) {
      return arrayMatch[1].split(',').map(
        value => this.parse(value.trim())
      );
    }

    if (literal.test(token)) {
      return JSON.parse(token);
    }

    if (this.has(token)) {
      return this.get(token);
    }

    throw new ReferenceError(`${token} is not defined`);
  }
};

setWorldConstructor(World);
