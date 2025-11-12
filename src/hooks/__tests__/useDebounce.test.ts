import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDebounce } from '../useDebounce';
import { act } from 'react';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('updates value after delay expires', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 500 });

    // Value should still be initial before delay
    expect(result.current).toBe('initial');

    // Fast-forward time and flush pending promises
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Value should now be updated
    expect(result.current).toBe('updated');
  });

  it('resets timer on value change', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // First update
    rerender({ value: 'first', delay: 500 });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    // Second update before first delay completes
    rerender({ value: 'second', delay: 500 });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    // Value should still be initial (timer was reset)
    expect(result.current).toBe('initial');

    // Complete the second delay
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    // Value should now be updated to second
    expect(result.current).toBe('second');
  });

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const { unmount } = renderHook(() => useDebounce('test', 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('works with different data types', async () => {
    // Test with number
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 42 } }
    );
    expect(numberResult.current).toBe(42);

    numberRerender({ value: 100 });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(numberResult.current).toBe(100);

    // Test with object
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: { name: 'test' } } }
    );
    expect(objectResult.current).toEqual({ name: 'test' });

    objectRerender({ value: { name: 'updated' } });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(objectResult.current).toEqual({ name: 'updated' });
  });

  it('uses default delay of 500ms when not specified', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    await act(async () => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe('initial');

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('updated');
  });
});
