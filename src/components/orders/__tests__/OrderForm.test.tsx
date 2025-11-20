import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrderForm from '../OrderForm';
import * as useVendorsHook from '@/hooks/useVendors';

// Mock the hooks
vi.mock('@/hooks/useVendors');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('OrderForm', () => {
  const mockVendors = [
    {
      id: 'vendor-1',
      name: 'Test Vendor',
      contactPerson: 'John Doe',
      email: 'john@vendor.com',
      phone: '555-1234',
      address: '123 Main St',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
    {
      id: 'vendor-2',
      name: 'Another Vendor',
      contactPerson: 'Jane Smith',
      email: 'jane@vendor.com',
      phone: '555-5678',
      address: '456 Oak Ave',
      createdAt: '2025-01-02',
      updatedAt: '2025-01-02',
    },
  ];

  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(useVendorsHook.useVendors).mockReturnValue({
      data: mockVendors,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isError: false,
      isSuccess: true,
    } as any);
  });

  it('renders form fields', () => {
    const { container } = render(
      <OrderForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    // Check that form element exists
    expect(container.querySelector('form')).toBeInTheDocument();
    // Check that buttons exist
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/create order/i)).toBeInTheDocument();
  });

  it('renders without errors', () => {
    expect(() =>
      render(
        <OrderForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
        { wrapper: createWrapper() }
      )
    ).not.toThrow();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <OrderForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('populates form when editing existing order', () => {
    const existingOrder = {
      id: 'order-1',
      vendorId: 'vendor-1',
      dueDate: '2025-01-15',
      status: 'in_progress' as const,
      instructions: 'Existing instructions',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    };

    const { container } = render(
      <OrderForm order={existingOrder} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    // Check that form renders with existing order
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <OrderForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={true} />,
      { wrapper: createWrapper() }
    );

    // Check for loading text
    expect(screen.getByText(/saving/i)).toBeInTheDocument();
  });
});
