import ReactDOMServer from 'react-dom/server';
import { When, Then } from '@cucumber/cucumber';
import World from '../world';
import assert from 'assert';

When(
  'I render {string} to static markup',
  function (this: World, elementName: string) {
    const element: JSX.Element = this.get(elementName);

    this.output = ReactDOMServer.renderToStaticMarkup(element);
  }
);

Then(
  'it should output',
  function (this: World, expected: string) {
    assert.strictEqual(this.output, expected);
  }
);
