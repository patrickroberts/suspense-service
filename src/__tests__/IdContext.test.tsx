import React, { ReactNode } from 'react';
import { ReactTestRenderer, act, create } from 'react-test-renderer';
import mockRender from '../__fixtures__/mockRender';
import withIdContext from '../__fixtures__/withIdContext';
import { createIdContext } from '../IdContext';

describe('IdContext', () => {
  beforeEach(() => {
    mockRender.mockClear();
  });

  let useIdContextSpy: jest.SpyInstance;

  beforeAll(() => {
    const actual = jest.requireActual<typeof import('../IdContext')>('../IdContext');
    const actualUseIdContext = actual.useIdContext;

    useIdContextSpy = jest.spyOn(actual, 'useIdContext').mockImplementation(
      (context, id) => actualUseIdContext(context, id),
    );
  });

  beforeEach(() => {
    useIdContextSpy.mockClear();
  });

  let root: ReactTestRenderer;

  afterEach(() => {
    root.unmount();
  });

  it('should pass default value to Consumer render callback', () => {
    const defaultValue = 1;
    const UnderTest = createIdContext(defaultValue);

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

  it('should pass default value to useIdContext hook', () => {
    const defaultValue = 1;
    const UnderTest = createIdContext<ReactNode>(defaultValue);
    const Consumer = withIdContext(UnderTest);

    act(() => {
      root = create(<Consumer />);
    });

    expect(useIdContextSpy).toBeCalledWith(UnderTest, null);
    expect(useIdContextSpy).toReturnWith(defaultValue);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <div>
        ${defaultValue}
      </div>
    `);
  });

  it('should pass value from Provider to Consumer render callback', () => {
    const value = 2;
    const UnderTest = createIdContext(1);

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

  it('should pass value from Provider to useIdContext hook', () => {
    const value = 2;
    const UnderTest = createIdContext<ReactNode>(1);
    const Consumer = withIdContext(UnderTest);

    act(() => {
      root = create(
        <UnderTest.Provider value={value}>
          <Consumer />
        </UnderTest.Provider>,
      );
    });

    expect(useIdContextSpy).toBeCalledWith(UnderTest, null);
    expect(useIdContextSpy).toReturnWith(value);
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
    const UnderTest = createIdContext(1);

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

  it('should pass value from outer Provider to useIdContext hook', () => {
    const outerValue = 3;
    const innerValue = 2;
    const outerId = 'a';
    const innerId = 'b';
    const UnderTest = createIdContext<ReactNode>(1);
    const Consumer = withIdContext(UnderTest);

    act(() => {
      root = create(
        <UnderTest.Provider value={outerValue} id={outerId}>
          <UnderTest.Provider value={innerValue} id={innerId}>
            <Consumer id={outerId} />
          </UnderTest.Provider>
        </UnderTest.Provider>,
      );
    });

    expect(useIdContextSpy).toBeCalledWith(UnderTest, outerId);
    expect(useIdContextSpy).toReturnWith(outerValue);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <div>
        ${outerValue}
      </div>
    `);
  });
});
