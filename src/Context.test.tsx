import React, { ComponentType, ReactNode } from 'react';
import { ReactTestRenderer, create } from 'react-test-renderer';
import Context, { createContext, useContext } from './Context';

describe('Context', () => {
  let UnderTest: Context<number>;
  let Component: ComponentType<{ id?: string }>;
  let render: (value: number) => ReactNode;
  let root: ReactTestRenderer;

  beforeAll(() => {
    UnderTest = createContext(1);
    Component = ({ id = null }) => (
      <div>{useContext(UnderTest, id)}</div>
    );
    render = (value) => <span>{value}</span>;
  });

  afterEach(() => {
    root.unmount();
  });

  it('should pass default value to Consumer render callback', () => {
    root = create(
      <UnderTest.Consumer>{render}</UnderTest.Consumer>,
    );

    expect(root.toJSON()).toMatchInlineSnapshot(`
      <span>
        1
      </span>
    `);
  });

  it('should pass default value to useContext hook', () => {
    root = create(<Component />);

    expect(root.toJSON()).toMatchInlineSnapshot(`
      <div>
        1
      </div>
    `);
  });

  it('should pass value from Provider to Consumer render callback', () => {
    root = create(
      <UnderTest.Provider value={2}>
        <UnderTest.Consumer>{render}</UnderTest.Consumer>
      </UnderTest.Provider>,
    );

    expect(root.toJSON()).toMatchInlineSnapshot(`
      <span>
        2
      </span>
    `);
  });

  it('should pass value from Provider to useContext hook', () => {
    root = create(
      <UnderTest.Provider value={2}>
        <Component />
      </UnderTest.Provider>,
    );

    expect(root.toJSON()).toMatchInlineSnapshot(`
      <div>
        2
      </div>
    `);
  });

  it('should pass value from outer Provider to Consumer render callback', () => {
    root = create(
      <UnderTest.Provider value={3} id="a">
        <UnderTest.Provider value={2}>
          <UnderTest.Consumer id="a">
            {render}
          </UnderTest.Consumer>
        </UnderTest.Provider>
      </UnderTest.Provider>,
    );

    expect(root.toJSON()).toMatchInlineSnapshot(`
      <span>
        3
      </span>
    `);
  });

  it('should pass value from outer Provider to useContext hook', () => {
    root = create(
      <UnderTest.Provider value={3} id="a">
        <UnderTest.Provider value={2}>
          <Component id="a" />
        </UnderTest.Provider>
      </UnderTest.Provider>,
    );

    expect(root.toJSON()).toMatchInlineSnapshot(`
      <div>
        3
      </div>
    `);
  });
});
