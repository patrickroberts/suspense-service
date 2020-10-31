import { promisify } from 'util';
import React, { ReactNode, Suspense } from 'react';
import { ReactTestRenderer, act, create } from 'react-test-renderer';
import ErrorBoundary from '../__fixtures__/ErrorBoundary';
import mockRender from '../__fixtures__/mockRender';
import withService from '../__fixtures__/withService';
import { createService } from '../Service';

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

  const whenAllSettledPromisesAreFlushed = promisify(setImmediate);

  describe('expected errors', () => {
    beforeEach(() => {
      mockRender.mockClear();
    });

    beforeEach(() => {
      useServiceSpy.mockClear();
    });

    afterEach(() => {
      root.unmount();
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
      expect(mockOnError).toBeCalledWith(expect.any(Error));
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

      act(() => {
        root = create(
          <ErrorBoundary fallback={<pre>error</pre>} onError={mockOnError}>
            <Consumer />
          </ErrorBoundary>,
        );
      });

      expect(useServiceSpy).toBeCalledWith(UnderTest, null);
      expect(useServiceSpy.mock.results[0].type).toBe('throw');
      expect(useServiceSpy.mock.results[0].value).toBeInstanceOf(Error);
      expect(mockHandler).not.toBeCalled();
      expect(mockOnError).toBeCalledWith(expect.any(Error));
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
          <UnderTest.Provider request={request}>
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
        await whenAllSettledPromisesAreFlushed();
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
          <UnderTest.Provider request={request}>
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
        await whenAllSettledPromisesAreFlushed();
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

  it('should not call handler multiple times with same request', () => {
    const request = 0;
    const mockHandler = jest.fn();
    const UnderTest = createService<number, never>(mockHandler);

    act(() => {
      root = create(
        <UnderTest.Provider request={request} />,
      );
    });

    expect(mockHandler).toBeCalledTimes(1);
    expect(mockHandler).toBeCalledWith(request, null);

    mockHandler.mockClear();

    act(() => {
      root.update(
        <UnderTest.Provider request={request} />,
      );
    });

    expect(mockHandler).not.toBeCalled();
  });

  it('should call handler multiple times with different requests', () => {
    let request = 0;
    const mockHandler = jest.fn();
    const UnderTest = createService<number, never>(mockHandler);

    act(() => {
      root = create(
        <UnderTest.Provider request={request} />,
      );
    });

    expect(mockHandler).toBeCalledTimes(1);
    expect(mockHandler).toBeCalledWith(request, null);

    request = 1;
    mockHandler.mockClear();

    act(() => {
      root.update(
        <UnderTest.Provider request={request} />,
      );
    });

    expect(mockHandler).toBeCalledTimes(1);
    expect(mockHandler).toBeCalledWith(request, null);
  });

  it('should pass response from Provider to Consumer render callback', async () => {
    const request = 1;
    const response = 'one';
    const mockHandler = jest.fn().mockResolvedValueOnce(response);
    const UnderTest = createService<number, string>(mockHandler);

    act(() => {
      root = create(
        <UnderTest.Provider request={request}>
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
      await whenAllSettledPromisesAreFlushed();
    });

    expect(mockRender).toBeCalledWith(response, expect.any(Function));
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
        <UnderTest.Provider request={request}>
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
      await whenAllSettledPromisesAreFlushed();
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
    const mockHandler = jest.fn(
      async (request: number) => (
        request === outerRequest
          ? outerResponse
          : innerResponse
      ),
    );
    const UnderTest = createService<number, string>(mockHandler);

    act(() => {
      root = create(
        <UnderTest.Provider request={3} id={outerId}>
          <UnderTest.Provider request={2} id={innerId}>
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
    expect(mockHandler).toBeCalledWith(outerRequest, outerId);
    expect(mockHandler).toBeCalledWith(innerRequest, innerId);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <p>
        suspended
      </p>
    `);

    mockRender.mockClear();
    mockHandler.mockClear();

    await act(async () => {
      await whenAllSettledPromisesAreFlushed();
    });

    expect(mockRender).toBeCalledWith(outerResponse, expect.any(Function));
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
    const mockHandler = jest.fn(
      async (request: number) => (
        request === outerRequest
          ? outerResponse
          : innerResponse
      ),
    );
    const UnderTest = createService<number, ReactNode>(mockHandler);
    const Consumer = withService(UnderTest);

    act(() => {
      root = create(
        <UnderTest.Provider request={outerRequest} id={outerId}>
          <UnderTest.Provider request={innerRequest} id={innerId}>
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
    expect(mockHandler).toBeCalledWith(outerRequest, outerId);
    expect(mockHandler).toBeCalledWith(innerRequest, innerId);
    expect(root.toJSON()).toMatchInlineSnapshot(`
      <p>
        suspended
      </p>
    `);

    useServiceSpy.mockClear();
    mockHandler.mockClear();

    await act(async () => {
      await whenAllSettledPromisesAreFlushed();
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
        <UnderTest.Provider request={request} fallback={<p>suspended</p>}>
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
      await whenAllSettledPromisesAreFlushed();
    });

    expect(mockRender).toBeCalledWith(response, expect.any(Function));
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
        <UnderTest.Provider request={request} fallback={<p>suspended</p>}>
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
      await whenAllSettledPromisesAreFlushed();
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
    const mockHandler = jest.fn().mockReturnValueOnce(Promise.race([]));
    const UnderTest = createService<number, never>(mockHandler);

    act(() => {
      root = create(
        <UnderTest.Provider request={request}>
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
