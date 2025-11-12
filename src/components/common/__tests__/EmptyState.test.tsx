import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from '../EmptyState';
import { Package } from 'lucide-react';

describe('EmptyState', () => {
  it('renders icon, title, and description', () => {
    render(
      <EmptyState
        icon={Package}
        title="No Orders Found"
        description="There are no orders to display at this time."
      />
    );

    expect(screen.getByText('No Orders Found')).toBeInTheDocument();
    expect(screen.getByText('There are no orders to display at this time.')).toBeInTheDocument();
  });

  it('shows action button when actionLabel and onAction provided', () => {
    const mockOnAction = vi.fn();

    render(
      <EmptyState
        icon={Package}
        title="No Orders"
        description="Get started by creating your first order."
        actionLabel="Create Order"
        onAction={mockOnAction}
      />
    );

    const button = screen.getByRole('button', { name: 'Create Order' });
    expect(button).toBeInTheDocument();
  });

  it('hides action button when actionLabel is missing', () => {
    const mockOnAction = vi.fn();

    render(
      <EmptyState
        icon={Package}
        title="No Orders"
        description="No orders available."
        onAction={mockOnAction}
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('hides action button when onAction is missing', () => {
    render(
      <EmptyState
        icon={Package}
        title="No Orders"
        description="No orders available."
        actionLabel="Create Order"
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onAction when button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnAction = vi.fn();

    render(
      <EmptyState
        icon={Package}
        title="No Orders"
        description="Get started now."
        actionLabel="Create Order"
        onAction={mockOnAction}
      />
    );

    const button = screen.getByRole('button', { name: 'Create Order' });
    await user.click(button);

    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });
});
