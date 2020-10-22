import React, { ReactNode } from 'react';
import { ReactTestRenderer, act, create } from 'react-test-renderer';
import mockRender from '../__fixtures__/mockRender';
import withContext from '../__fixtures__/withContext';
import { createContext } from '../Context';

describe('Context', () => {
  beforeEach(() => {
    mockRender.mockClear();
  });

  let useContextSpy: jest.SpyInstance;

  beforeAll(() => {
    const actual = jest.requireActual<typeof import('../Context')>('../Context');
    const actualUseContext = actual.useContext;

    useContextSpy = jest.spyOn(actual, 'useContext').mockImplementation(
      (context, id) => actualUseContext(context, id),
    );
  });

  beforeEach(() => {
    useContextSpy.mockClear();
  });

  let root: ReactTestRenderer;

  afterEach(() => {
    root.unmount();
  });

  it('should pass default value to Consumer render callback', () => {
    const defaultValue = 1;
    const UnderTest = createContext(defaultValue);

    act(() => {
      root = create(
        <UnderTest.Consumer>
          {mockRender}
        </UnderTest.Consumer>,
      );
    });

    expect(mockRender).toBeCalledWith(defaultValue);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <span>
        ${defaultValue}
      </span>
    `);
  });

  it('should pass default value to useContext hook', () => {
    const defaultValue = 1;
    const UnderTest = createContext<ReactNode>(defaultValue);
    const Consumer = withContext(UnderTest);

    act(() => {
      root = create(<Consumer />);
    });

    expect(useContextSpy).toBeCalledWith(UnderTest, null);
    expect(useContextSpy).toReturnWith(defaultValue);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <div>
        ${defaultValue}
      </div>
    `);
  });

  it('should pass value from Provider to Consumer render callback', () => {
    const value = 2;
    const UnderTest = createContext(1);

    act(() => {
      root = create(
        <UnderTest.Provider value={value}>
          <UnderTest.Consumer>
            {mockRender}
          </UnderTest.Consumer>
        </UnderTest.Provider>,
      );
    });

    expect(mockRender).toBeCalledWith(value);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <span>
        ${value}
      </span>
    `);
  });

  it('should pass value from Provider to useContext hook', () => {
    const value = 2;
    const UnderTest = createContext<ReactNode>(1);
    const Consumer = withContext(UnderTest);

    act(() => {
      root = create(
        <UnderTest.Provider value={value}>
          <Consumer />
        </UnderTest.Provider>,
      );
    });

    expect(useContextSpy).toBeCalledWith(UnderTest, null);
    expect(useContextSpy).toReturnWith(value);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <div>
        ${value}
      </div>
    `);
  });

  it('should pass value from outer Provider to Consumer render callback', () => {
    const outerValue = 3;
    const innerValue = 2;
    const outerId = 'a';
    const innerId = 'b';
    const UnderTest = createContext(1);

    act(() => {
      root = create(
        <UnderTest.Provider value={outerValue} id={outerId}>
          <UnderTest.Provider value={innerValue} id={innerId}>
            <UnderTest.Consumer id={outerId}>
              {mockRender}
            </UnderTest.Consumer>
          </UnderTest.Provider>
        </UnderTest.Provider>,
      );
    });

    expect(mockRender).toBeCalledWith(outerValue);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <span>
        ${outerValue}
      </span>
    `);
  });

  it('should pass value from outer Provider to useContext hook', () => {
    const outerValue = 3;
    const innerValue = 2;
    const outerId = 'a';
    const innerId = 'b';
    const UnderTest = createContext<ReactNode>(1);
    const Consumer = withContext(UnderTest);

    act(() => {
      root = create(
        <UnderTest.Provider value={outerValue} id={outerId}>
          <UnderTest.Provider value={innerValue} id={innerId}>
            <Consumer id={outerId} />
          </UnderTest.Provider>
        </UnderTest.Provider>,
      );
    });

    expect(useContextSpy).toBeCalledWith(UnderTest, outerId);
    expect(useContextSpy).toReturnWith(outerValue);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <div>
        ${outerValue}
      </div>
    `);
  });
});
