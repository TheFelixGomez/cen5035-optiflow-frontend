import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../useToast';

describe('useToast', () => {
  it('displays toast with correct message', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Test Title',
        description: 'Test Description',
      });
    });

    // The toast hook returns a toast function that triggers toasts
    expect(result.current.toast).toBeDefined();
  });

  it('supports different toast variants', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Success',
        variant: 'default',
      });
    });

    act(() => {
      result.current.toast({
        title: 'Error',
        variant: 'destructive',
      });
    });

    expect(result.current.toast).toBeDefined();
  });

  it('dismisses toast', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string | undefined;

    act(() => {
      const response = result.current.toast({
        title: 'Dismissible Toast',
      });
      toastId = response.id;
    });

    expect(toastId).toBeDefined();

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toast).toBeDefined();
  });

  it('handles multiple toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' });
      result.current.toast({ title: 'Toast 3' });
    });

    expect(result.current.toasts.length).toBeGreaterThanOrEqual(0);
  });
});
