import React, { ReactNode, Suspense } from 'react';
import { ReactTestRenderer, act, create } from 'react-test-renderer';
import ErrorBoundary from '../__fixtures__/ErrorBoundary';
import mockRender from '../__fixtures__/mockRender';
import withService from '../__fixtures__/withService';
import { createService } from '../Service';

const allPromiseChainsAdoptingSettledPromises = () => (
  new Promise((resolve) => {
    setImmediate(resolve);
  })
);

describe('Service', () => {
  beforeEach(() => {
    mockRender.mockClear();
  });

  let useServiceSpy: jest.SpyInstance;

  beforeAll(() => {
    const actual = jest.requireActual<typeof import('../Service')>('../Service');
    const actualUseService = actual.useService;

    useServiceSpy = jest.spyOn(actual, 'useService').mockImplementation(
      (service, id) => actualUseService(service, id),
    );
  });

  beforeEach(() => {
    useServiceSpy.mockClear();
  });

  let root: ReactTestRenderer;

  afterEach(() => {
    root.unmount();
  });

  describe('expected errors', () => {
    let noProviderError: Error;
    let createContextSpy: jest.SpyInstance;

    beforeEach(() => {
      const actual = jest.requireActual<typeof import('../Context')>('../Context');
      const actualCreateContext = actual.createContext;

      noProviderError = new Error();
      createContextSpy = jest.spyOn(actual, 'createContext').mockImplementationOnce(
        () => actualCreateContext<any>(() => {
          throw noProviderError;
        }),
      );
    });

    afterEach(() => {
      createContextSpy.mockRestore();
    });

    let mockConsoleErrorToSilenceErrorBoundaries: jest.SpyInstance;

    beforeEach(() => {
      mockConsoleErrorToSilenceErrorBoundaries = jest.spyOn(
        console, 'error',
      ).mockImplementation(
        () => undefined,
      );
    });

    afterEach(() => {
      mockConsoleErrorToSilenceErrorBoundaries.mockRestore();
    });

    it('should error if Consumer is rendered without Provider', async () => {
      const mockHandler = jest.fn();
      const mockOnError = jest.fn();
      const UnderTest = createService<unknown, string>(mockHandler);

      expect(createContextSpy).toBeCalledTimes(1);
      expect(createContextSpy.mock.calls[0][0]).toThrow();

      act(() => {
        root = create(
          <ErrorBoundary fallback={<pre>error</pre>} onError={mockOnError}>
            <UnderTest.Consumer>
              {mockRender}
            </UnderTest.Consumer>
          </ErrorBoundary>,
        );
      });

      expect(mockRender).not.toBeCalled();
      expect(mockHandler).not.toBeCalled();
      expect(mockOnError).toBeCalledWith(noProviderError);
      expect(root.toJSON()).toMatchInlineSnapshot(`
        <pre>
          error
        </pre>
      `);
    });

    it('should error if useService is called without Provider', () => {
      const mockHandler = jest.fn();
      const mockOnError = jest.fn();
      const UnderTest = createService<unknown, ReactNode>(mockHandler);
      const Consumer = withService(UnderTest);

      expect(createContextSpy).toBeCalledTimes(1);
      expect(createContextSpy.mock.calls[0][0]).toThrow();

      act(() => {
        root = create(
          <ErrorBoundary fallback={<pre>error</pre>} onError={mockOnError}>
            <Consumer />
          </ErrorBoundary>,
        );
      });

      expect(useServiceSpy).toBeCalledWith(UnderTest, null);
      expect(useServiceSpy.mock.results[0].type).toBe('throw');
      expect(useServiceSpy.mock.results[0].value).toBe(noProviderError);
      expect(mockHandler).not.toBeCalled();
      expect(mockOnError).toBeCalledWith(noProviderError);
      expect(root.toJSON()).toMatchInlineSnapshot(`
        <pre>
          error
        </pre>
      `);
    });

    it('should error if Consumer is rendered with rejected handler', async () => {
      const request = 0;
      const handlerError = new Error();
      const mockHandler = jest.fn().mockRejectedValueOnce(handlerError);
      const mockOnError = jest.fn();
      const UnderTest = createService<number, string>(mockHandler);

      act(() => {
        root = create(
          <UnderTest.Provider value={request}>
            <ErrorBoundary fallback={<pre>error</pre>} onError={mockOnError}>
              <Suspense fallback={<p>suspended</p>}>
                <UnderTest.Consumer>
                  {mockRender}
                </UnderTest.Consumer>
              </Suspense>
            </ErrorBoundary>
          </UnderTest.Provider>,
        );
      });

      expect(mockRender).not.toBeCalled();
      expect(mockHandler).toBeCalledWith(request, null);
      expect(mockOnError).not.toBeCalled();
      expect(root.toJSON()).toMatchInlineSnapshot(`
        <p>
          suspended
        </p>
      `);

      mockRender.mockClear();
      mockHandler.mockClear();
      mockOnError.mockClear();

      await act(async () => {
        await allPromiseChainsAdoptingSettledPromises();
      });

      expect(mockRender).not.toBeCalled();
      expect(mockHandler).not.toBeCalled();
      expect(mockOnError).toBeCalledWith(handlerError);
      expect(root.toJSON()).toMatchInlineSnapshot(`
        <pre>
          error
        </pre>
      `);
    });

    it('should error if useService is called with rejected handler', async () => {
      const request = 0;
      const handlerError = new Error();
      const mockHandler = jest.fn().mockRejectedValueOnce(handlerError);
      const mockOnError = jest.fn();
      const UnderTest = createService<number, ReactNode>(mockHandler);
      const Consumer = withService(UnderTest);

      act(() => {
        root = create(
          <UnderTest.Provider value={request}>
            <ErrorBoundary fallback={<pre>error</pre>} onError={mockOnError}>
              <Suspense fallback={<p>suspended</p>}>
                <Consumer />
              </Suspense>
            </ErrorBoundary>
          </UnderTest.Provider>,
        );
      });

      expect(useServiceSpy).toBeCalledWith(UnderTest, null);
      expect(useServiceSpy.mock.results[0].type).toBe('throw');
      expect(useServiceSpy.mock.results[0].value).rejects.toBe(handlerError);
      expect(mockHandler).toBeCalledWith(request, null);
      expect(mockOnError).not.toBeCalled();
      expect(root.toJSON()).toMatchInlineSnapshot(`
        <p>
          suspended
        </p>
      `);

      useServiceSpy.mockClear();
      mockHandler.mockClear();
      mockOnError.mockClear();

      await act(async () => {
        await allPromiseChainsAdoptingSettledPromises();
      });

      expect(useServiceSpy).toBeCalledWith(UnderTest, null);
      expect(useServiceSpy.mock.results[0].type).toBe('throw');
      expect(useServiceSpy.mock.results[0].value).toBe(handlerError);
      expect(mockHandler).not.toBeCalled();
      expect(mockOnError).toBeCalledWith(handlerError);
      expect(root.toJSON()).toMatchInlineSnapshot(`
        <pre>
          error
        </pre>
      `);
    });
  });

  it('should pass response from Provider to Consumer render callback', async () => {
    const request = 1;
    const response = 'one';
    const mockHandler = jest.fn().mockResolvedValueOnce(response);
    const UnderTest = createService<number, string>(mockHandler);

    act(() => {
      root = create(
        <UnderTest.Provider value={request}>
          <Suspense fallback={<p>suspended</p>}>
            <UnderTest.Consumer>
              {mockRender}
            </UnderTest.Consumer>
          </Suspense>
        </UnderTest.Provider>,
      );
    });

    expect(mockRender).not.toBeCalled();
    expect(mockHandler).toBeCalledWith(request, null);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <p>
        suspended
      </p>
    `);

    mockRender.mockClear();
    mockHandler.mockClear();

    await act(async () => {
      await allPromiseChainsAdoptingSettledPromises();
    });

    expect(mockRender).toBeCalledWith(response);
    expect(mockHandler).not.toBeCalled();
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <span>
        ${response}
      </span>
    `);
  });

  it('should pass response from Provider to useService hook', async () => {
    const request = 2;
    const response = 'two';
    const mockHandler = jest.fn().mockResolvedValueOnce(response);
    const UnderTest = createService<number, ReactNode>(mockHandler);
    const Consumer = withService(UnderTest);

    act(() => {
      root = create(
        <UnderTest.Provider value={request}>
          <Suspense fallback={<p>suspended</p>}>
            <Consumer />
          </Suspense>
        </UnderTest.Provider>,
      );
    });

    expect(useServiceSpy).toBeCalledWith(UnderTest, null);
    expect(useServiceSpy.mock.results[0].type).toBe('throw');
    expect(useServiceSpy.mock.results[0].value).resolves.toBe(response);
    expect(mockHandler).toBeCalledWith(request, null);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <p>
        suspended
      </p>
    `);

    useServiceSpy.mockClear();
    mockHandler.mockClear();

    await act(async () => {
      await allPromiseChainsAdoptingSettledPromises();
    });

    expect(useServiceSpy).toBeCalledWith(UnderTest, null);
    expect(useServiceSpy).toReturnWith(response);
    expect(mockHandler).not.toBeCalled();
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <div>
        ${response}
      </div>
    `);
  });

  it('should pass response from outer Provider to Consumer render callback', async () => {
    const outerRequest = 3;
    const innerRequest = 2;
    const outerId = 'a';
    const innerId = 'b';
    const outerResponse = 'three';
    const innerResponse = 'two';
    const mockHandler = jest.fn()
      .mockResolvedValueOnce(innerResponse)
      .mockResolvedValueOnce(outerResponse);
    const UnderTest = createService<number, string>(mockHandler);

    act(() => {
      root = create(
        <UnderTest.Provider value={3} id={outerId}>
          <UnderTest.Provider value={2} id={innerId}>
            <Suspense fallback={<p>suspended</p>}>
              <UnderTest.Consumer id={outerId}>
                {mockRender}
              </UnderTest.Consumer>
            </Suspense>
          </UnderTest.Provider>
        </UnderTest.Provider>,
      );
    });

    expect(mockRender).not.toBeCalled();
    expect(mockHandler).nthCalledWith(1, innerRequest, innerId);
    expect(mockHandler).nthCalledWith(2, outerRequest, outerId);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <p>
        suspended
      </p>
    `);

    mockRender.mockClear();
    mockHandler.mockClear();

    await act(async () => {
      await allPromiseChainsAdoptingSettledPromises();
    });

    expect(mockRender).toBeCalledWith(outerResponse);
    expect(mockHandler).not.toBeCalled();
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <span>
        ${outerResponse}
      </span>
    `);
  });

  it('should pass response from outer Provider to useService hook', async () => {
    const outerRequest = 3;
    const innerRequest = 2;
    const outerId = 'a';
    const innerId = 'b';
    const outerResponse = 'three';
    const innerResponse = 'two';
    const mockHandler = jest.fn()
      .mockResolvedValueOnce(innerResponse)
      .mockResolvedValueOnce(outerResponse);
    const UnderTest = createService<number, ReactNode>(mockHandler);
    const Consumer = withService(UnderTest);

    act(() => {
      root = create(
        <UnderTest.Provider value={outerRequest} id={outerId}>
          <UnderTest.Provider value={innerRequest} id={innerId}>
            <Suspense fallback={<p>suspended</p>}>
              <Consumer id={outerId} />
            </Suspense>
          </UnderTest.Provider>
        </UnderTest.Provider>,
      );
    });

    expect(useServiceSpy).toBeCalledWith(UnderTest, outerId);
    expect(useServiceSpy.mock.results[0].type).toBe('throw');
    expect(useServiceSpy.mock.results[0].value).resolves.toBe(outerResponse);
    expect(mockHandler).nthCalledWith(1, innerRequest, innerId);
    expect(mockHandler).nthCalledWith(2, outerRequest, outerId);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <p>
        suspended
      </p>
    `);

    useServiceSpy.mockClear();
    mockHandler.mockClear();

    await act(async () => {
      await allPromiseChainsAdoptingSettledPromises();
    });

    expect(useServiceSpy).toBeCalledWith(UnderTest, outerId);
    expect(useServiceSpy).toReturnWith(outerResponse);
    expect(mockHandler).not.toBeCalled();
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <div>
        ${outerResponse}
      </div>
    `);
  });

  it('should suspend Consumer render callback if fallback is specified', async () => {
    const request = 4;
    const response = 'four';
    const mockHandler = jest.fn().mockResolvedValueOnce(response);
    const UnderTest = createService<number, string>(mockHandler);

    act(() => {
      root = create(
        <UnderTest.Provider value={request} fallback={<p>suspended</p>}>
          <UnderTest.Consumer>
            {mockRender}
          </UnderTest.Consumer>
        </UnderTest.Provider>,
      );
    });

    expect(mockRender).not.toBeCalled();
    expect(mockHandler).toBeCalledWith(request, null);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <p>
        suspended
      </p>
    `);

    mockRender.mockClear();
    mockHandler.mockClear();

    await act(async () => {
      await allPromiseChainsAdoptingSettledPromises();
    });

    expect(mockRender).toBeCalledWith(response);
    expect(mockHandler).not.toBeCalled();
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <span>
        ${response}
      </span>
    `);
  });

  it('should suspend useService hook if fallback is specified', async () => {
    const request = 5;
    const response = 'five';
    const mockHandler = jest.fn().mockResolvedValueOnce(response);
    const UnderTest = createService<number, ReactNode>(mockHandler);
    const Consumer = withService(UnderTest);

    act(() => {
      root = create(
        <UnderTest.Provider value={request} fallback={<p>suspended</p>}>
          <Consumer />
        </UnderTest.Provider>,
      );
    });

    expect(useServiceSpy).toBeCalledWith(UnderTest, null);
    expect(useServiceSpy.mock.results[0].type).toBe('throw');
    expect(useServiceSpy.mock.results[0].value).resolves.toBe(response);
    expect(mockHandler).toBeCalledWith(request, null);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <p>
        suspended
      </p>
    `);

    useServiceSpy.mockClear();
    mockHandler.mockClear();

    await act(async () => {
      await allPromiseChainsAdoptingSettledPromises();
    });

    expect(useServiceSpy).toBeCalledWith(UnderTest, null);
    expect(useServiceSpy).toReturnWith(response);
    expect(mockHandler).not.toBeCalled();
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <div>
        ${response}
      </div>
    `);
  });

  it('should not suspend if Provider is not consumed', async () => {
    const request = 6;
    const mockHandler = jest.fn().mockReturnValueOnce(new Promise(() => undefined));
    const UnderTest = createService<number, ReactNode>(mockHandler);

    act(() => {
      root = create(
        <UnderTest.Provider value={request}>
          <section>
            other
          </section>
        </UnderTest.Provider>,
      );
    });

    expect(mockHandler).toBeCalledWith(request, null);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <section>
        other
      </section>
    `);
  });
});
