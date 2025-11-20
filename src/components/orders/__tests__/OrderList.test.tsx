import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrderList from '../OrderList';
import * as useOrdersHook from '@/hooks/useOrders';
import type { Order } from '@/types/order.types';

// Mock the hooks
vi.mock('@/hooks/useOrders');

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

describe('OrderList', () => {
  const mockOrders: Order[] = [
    {
      id: 'order-1',
      vendorId: 'vendor-1',
      vendor: {
        id: 'vendor-1',
        name: 'Test Vendor',
        contactPerson: 'John Doe',
        email: 'john@vendor.com',
        phone: '555-1234',
        address: '123 Main St',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      },
      dueDate: '2025-01-15',
      status: 'pending',
      instructions: 'Test instructions',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
    {
      id: 'order-2',
      vendorId: 'vendor-2',
      vendor: {
        id: 'vendor-2',
        name: 'Another Vendor',
        contactPerson: 'Jane Smith',
        email: 'jane@vendor.com',
        phone: '555-5678',
        address: '456 Oak Ave',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      },
      dueDate: '2025-01-20',
      status: 'in_progress',
      instructions: 'Another test',
      createdAt: '2025-01-02',
      updatedAt: '2025-01-02',
    },
  ];

  const mockOnEdit = vi.fn();
  const mockOnView = vi.fn();
  const mockDeleteOrder = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(useOrdersHook.useOrders).mockReturnValue({
      data: mockOrders,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isError: false,
      isSuccess: true,
    } as any);

    vi.mocked(useOrdersHook.useDeleteOrder).mockReturnValue({
      mutate: mockDeleteOrder,
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);
  });

  it('renders list of orders', () => {
    render(
      <OrderList filters={{}} onEdit={mockOnEdit} onView={mockOnView} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Test Vendor')).toBeInTheDocument();
    expect(screen.getByText('Another Vendor')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useOrdersHook.useOrders).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
      isError: false,
      isSuccess: false,
    } as any);

    render(
      <OrderList filters={{}} onEdit={mockOnEdit} onView={mockOnView} />,
      { wrapper: createWrapper() }
    );

    // Loading skeleton should be rendered
    expect(screen.queryByText('Test Vendor')).not.toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useOrdersHook.useOrders).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch orders'),
      refetch: vi.fn(),
      isError: true,
      isSuccess: false,
    } as any);

    render(
      <OrderList filters={{}} onEdit={mockOnEdit} onView={mockOnView} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/error loading orders/i)).toBeInTheDocument();
  });

  it('shows empty state when no orders', () => {
    vi.mocked(useOrdersHook.useOrders).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isError: false,
      isSuccess: true,
    } as any);

    render(
      <OrderList filters={{}} onEdit={mockOnEdit} onView={mockOnView} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/no orders found/i)).toBeInTheDocument();
  });

  it('opens details dialog when row is clicked', async () => {
    const user = userEvent.setup();

    render(
      <OrderList filters={{}} onEdit={mockOnEdit} onView={mockOnView} />,
      { wrapper: createWrapper() }
    );

    const firstRow = screen.getByText('Test Vendor').closest('tr');
    if (firstRow) {
      await user.click(firstRow);
    }

    await waitFor(() => {
      expect(screen.getByText(/order details/i)).toBeInTheDocument();
    });
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <OrderList filters={{}} onEdit={mockOnEdit} onView={mockOnView} />,
      { wrapper: createWrapper() }
    );

    // Click row to open details
    const firstRow = screen.getByText('Test Vendor').closest('tr');
    if (firstRow) {
      await user.click(firstRow);
    }

    // Click edit button in dialog
    await waitFor(() => {
      const editButton = screen.getByRole('button', { name: /edit/i });
      return user.click(editButton);
    });

    await waitFor(() => {
      expect(mockOnEdit).toHaveBeenCalledWith(mockOrders[0]);
    });
  });

  it('displays order status badges', () => {
    render(
      <OrderList filters={{}} onEdit={mockOnEdit} onView={mockOnView} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });
});
