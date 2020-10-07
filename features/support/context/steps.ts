import assert from 'assert';
import { When, Then } from '@cucumber/cucumber';
import ReactDOMServer from 'react-dom/server';
import World from '../world';

When(
  'I render {string} to static markup',
  function renderToStaticMarkup(this: World, elementName: string) {
    const element: JSX.Element = this.get(elementName);

    this.output = ReactDOMServer.renderToStaticMarkup(element);
  },
);

Then(
  'it should output',
  function itShouldOutput(this: World, expected: string) {
    assert.strictEqual(this.output, expected);
  },
);
