// import apiClient from './client';
// import type { Order, CreateOrderData, UpdateOrderData, OrderFilters } from '@/types/order.types';

// export const ordersApi = {
//   getAll: async (filters?: OrderFilters): Promise<Order[]> => {
//     const response = await apiClient.get('/orders', { params: filters });
//     return response.data;
//   },

//   getById: async (id: string): Promise<Order> => {
//     const response = await apiClient.get(`/orders/${id}`);
//     return response.data;
//   },

//   create: async (data: CreateOrderData): Promise<Order> => {
//     const response = await apiClient.post('/orders', data);
//     return response.data;
//   },

//   update: async (id: string, data: UpdateOrderData): Promise<Order> => {
//     const response = await apiClient.put(`/orders/${id}`, data);
//     return response.data;
//   },

//   delete: async (id: string): Promise<void> => {
//     await apiClient.delete(`/orders/${id}`);
//   },
// };
import apiClient from './client';
import type { Order, CreateOrderData, UpdateOrderData, OrderFilters } from '@/types/order.types';

export const ordersApi = {
  getAll: async (filters?: OrderFilters): Promise<Order[]> => {
    const response = await apiClient.get('/orders', {
      withCredentials: true,
    });
    
    // Fetch vendors and users to enrich order data
    const [vendorsResponse, usersResponse] = await Promise.all([
      apiClient.get('/vendors', { withCredentials: true }),
      apiClient.get('/users', { withCredentials: true }).catch(() => ({ data: [] })),
    ]);
    
    const vendorsMap = new Map(vendorsResponse.data.map((v: any) => [v.id, v]));
    
    // Create user map - the user_id in orders is actually an email address
    const usersMap = new Map();
    usersResponse.data.forEach((u: any) => {
      // Map by both id and username (which is email)
      usersMap.set(u.id, u);
      usersMap.set(u.username, u);
    });
    
    // Transform backend response to frontend format
    let orders = response.data.map((o: any) => {
      const vendor = vendorsMap.get(o.vendor_id);
      // user_id in database is stored as email, so look up by that
      const user = o.user_id ? usersMap.get(o.user_id) : null;
      
      return {
        id: o.id,
        vendorId: o.vendor_id,
        vendor: vendor ? { id: vendor.id, name: vendor.name } : undefined,
        dueDate: o.due_at,
        status: o.status,
        instructions: o.special_instructions || '',
        createdAt: o.order_date || o.created_at || '',
        updatedAt: o.updated_at || '',
        userId: o.user_id,
        userName: user?.username || o.user_id || 'Unknown',
      };
    });
    
    // Client-side filtering
    if (filters?.vendorIds && filters.vendorIds.length > 0) {
      orders = orders.filter((o: Order) => filters.vendorIds!.includes(o.vendorId));
    }
    
    if (filters?.userIds && filters.userIds.length > 0) {
      orders = orders.filter((o: Order) => o.userId && filters.userIds!.includes(o.userId));
    }
    
    if (filters?.status) {
      orders = orders.filter((o: Order) => o.status === filters.status);
    }
    
    if (filters?.dateFrom) {
      orders = orders.filter((o: Order) => o.dueDate >= filters.dateFrom!);
    }
    
    if (filters?.dateTo) {
      orders = orders.filter((o: Order) => o.dueDate <= filters.dateTo!);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      orders = orders.filter((o: Order) => 
        o.id?.toLowerCase().includes(search) ||
        o.instructions?.toLowerCase().includes(search)
      );
    }
    
    return orders;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`, {
      withCredentials: true,   // <<< AQUI
    });
    return response.data;
  },

  create: async (data: CreateOrderData): Promise<Order> => {
    const response = await apiClient.post('/orders', data, {
      withCredentials: true,   // <<< AQUI
    });
    return response.data;
  },

  update: async (id: string, data: UpdateOrderData): Promise<Order> => {
    const response = await apiClient.put(`/orders/${id}`, data, {
      withCredentials: true,   // <<< AQUI
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/orders/${id}`, {
      withCredentials: true,   // <<< AQUI
    });
  },
};
