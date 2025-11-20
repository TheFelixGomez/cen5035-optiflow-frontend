import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VendorList from '../VendorList';
import * as useVendorsHook from '@/hooks/useVendors';
import type { Vendor } from '@/types/vendor.types';

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

describe('VendorList', () => {
  const mockVendors: Vendor[] = [
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

  const mockOnEdit = vi.fn();
  const mockOnView = vi.fn();
  const mockDeleteVendor = vi.fn();

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

    vi.mocked(useVendorsHook.useDeleteVendor).mockReturnValue({
      mutate: mockDeleteVendor,
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);
  });

  it('renders list of vendors', () => {
    render(
      <VendorList search="" onEdit={mockOnEdit} onView={mockOnView} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Test Vendor')).toBeInTheDocument();
    expect(screen.getByText('Another Vendor')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useVendorsHook.useVendors).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
      isError: false,
      isSuccess: false,
    } as any);

    render(
      <VendorList search="" onEdit={mockOnEdit} onView={mockOnView} />,
      { wrapper: createWrapper() }
    );

    // Loading skeleton should be rendered
    expect(screen.queryByText('Test Vendor')).not.toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useVendorsHook.useVendors).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch vendors'),
      refetch: vi.fn(),
      isError: true,
      isSuccess: false,
    } as any);

    render(
      <VendorList search="" onEdit={mockOnEdit} onView={mockOnView} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/error loading vendors/i)).toBeInTheDocument();
  });

  it('shows empty state when no vendors', () => {
    vi.mocked(useVendorsHook.useVendors).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isError: false,
      isSuccess: true,
    } as any);

    render(
      <VendorList search="" onEdit={mockOnEdit} onView={mockOnView} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/no vendors found/i)).toBeInTheDocument();
  });

  it('opens details dialog when row is clicked', async () => {
    const user = userEvent.setup();

    render(
      <VendorList search="" onEdit={mockOnEdit} onView={mockOnView} />,
      { wrapper: createWrapper() }
    );

    const firstRow = screen.getByText('Test Vendor').closest('tr');
    if (firstRow) {
      await user.click(firstRow);
    }

    await waitFor(() => {
      expect(screen.getByText(/vendor details/i)).toBeInTheDocument();
    });
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <VendorList search="" onEdit={mockOnEdit} onView={mockOnView} />,
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
      expect(mockOnEdit).toHaveBeenCalledWith(mockVendors[0]);
    });
  });

  it('displays vendor contact information', () => {
    render(
      <VendorList search="" onEdit={mockOnEdit} onView={mockOnView} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('john@vendor.com')).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
  });

  it('filters vendors based on search', () => {
    render(
      <VendorList search="Test" onEdit={mockOnEdit} onView={mockOnView} />,
      { wrapper: createWrapper() }
    );

    // useVendors hook should be called with search parameter
    expect(useVendorsHook.useVendors).toHaveBeenCalledWith('Test');
  });
});
