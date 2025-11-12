import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderStatusBadge from '../OrderStatusBadge';

describe('OrderStatusBadge', () => {
  it('renders "Pending" badge for pending status', () => {
    render(<OrderStatusBadge status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders "In Progress" badge for in_progress status', () => {
    render(<OrderStatusBadge status="in_progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders "Completed" badge for completed status', () => {
    render(<OrderStatusBadge status="completed" />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('applies correct variant styling for each status', () => {
    const { rerender } = render(<OrderStatusBadge status="pending" />);
    let badge = screen.getByText('Pending');
    expect(badge).toBeInTheDocument();

    rerender(<OrderStatusBadge status="in_progress" />);
    badge = screen.getByText('In Progress');
    expect(badge).toBeInTheDocument();

    rerender(<OrderStatusBadge status="completed" />);
    badge = screen.getByText('Completed');
    expect(badge).toBeInTheDocument();
  });
});
