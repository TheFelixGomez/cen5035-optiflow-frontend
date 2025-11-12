import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TableSkeleton, CardSkeleton, StatsSkeleton } from '../LoadingSkeleton';

describe('LoadingSkeleton', () => {
  describe('TableSkeleton', () => {
    it('renders table skeleton UI', () => {
      const { container } = render(<TableSkeleton />);
      
      // Check that component renders without errors
      expect(container.firstChild).toBeTruthy();
    });

    it('renders 5 skeleton rows', () => {
      const { container } = render(<TableSkeleton />);
      
      // Each row has flex items-center classes
      const rows = container.querySelectorAll('.flex');
      expect(rows.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('CardSkeleton', () => {
    it('renders card skeleton UI', () => {
      const { container } = render(<CardSkeleton />);
      
      // Check that component renders
      expect(container.firstChild).toBeTruthy();
    });

    it('renders without errors', () => {
      expect(() => render(<CardSkeleton />)).not.toThrow();
    });
  });

  describe('StatsSkeleton', () => {
    it('renders stats skeleton UI', () => {
      const { container } = render(<StatsSkeleton />);
      
      // Check that component renders
      expect(container.firstChild).toBeTruthy();
    });

    it('renders 4 stat cards', () => {
      const { container } = render(<StatsSkeleton />);
      
      // Should render a grid with 4 cards
      const grid = container.querySelector('.grid');
      expect(grid).toBeTruthy();
      expect(grid?.children.length).toBe(4);
    });
  });
});
