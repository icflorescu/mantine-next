import { useState } from 'react';

export function useAction<
  TAction extends (params: TParams, options?: { onSuccess?: (result: TResult) => void }) => Promise<TResult>,
  TParams = Parameters<TAction> extends [] ? undefined : Parameters<TAction>[0],
  TResult = Awaited<ReturnType<TAction>>,
>(
  action: TAction,
  options?: {
    onError?: (error: unknown) => void;
    onSuccess?: (result: TResult) => void;
  },
) {
  const [isExecuting, setIsExecuting] = useState(false);

  const execute = async (
    ...args: TParams extends undefined
      ? [
          params?: undefined,
          invocationOptions?: {
            onSuccess?: (result: TResult) => void;
            onError?: (error: unknown) => void;
          },
        ]
      : [
          params: TParams,
          invocationOptions?: {
            onSuccess?: (result: TResult) => void;
            onError?: (error: unknown) => void;
          },
        ]
  ) => {
    const [params, invocationOptions] = args;
    const { onError, onSuccess } = { ...options, ...invocationOptions };
    try {
      setIsExecuting(true);
      const result = await action(params as TParams, options);
      onSuccess?.(result);
      return result;
    } catch (err) {
      if (onError) {
        onError(err);
      } else {
        throw err;
      }
    } finally {
      setIsExecuting(false);
    }
  };

  return { execute, isExecuting } as const;
}
