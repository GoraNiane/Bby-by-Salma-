import {
  Product,
  Collection,
  Category,
  Order,
  Customer,
  Review,
  SiteContent,
  StoreSettings,
  AdminUser,
  DashboardData
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('bbs_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = 'Une erreur est survenue';
    try {
      const data = await res.json();
      errorMsg = data.error || errorMsg;
    } catch {
      errorMsg = `Erreur HTTP ${res.status}`;
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // --- AUTH ---
  async login(email: string, password: string): Promise<{ success: boolean; token: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async getMe(): Promise<{ user: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async updateProfile(data: { name?: string; email?: string; currentPassword?: string; newPassword?: string; avatar?: string }): Promise<{ success: boolean; user: AdminUser; message: string }> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // --- PRODUCTS ---
  async getProducts(params?: { category?: string; collection?: string; status?: string; search?: string; featured?: boolean; bestSeller?: boolean; isNew?: boolean }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.collection) query.append('collection', params.collection);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.featured) query.append('featured', 'true');
    if (params?.bestSeller) query.append('bestSeller', 'true');
    if (params?.isNew) query.append('isNew', 'true');

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    return handleResponse(res);
  },

  async getProduct(idOrSlug: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
    return handleResponse(res);
  },

  async createProduct(data: Partial<Product>): Promise<{ success: boolean; product: Product; message: string }> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<{ success: boolean; product: Product; message: string }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateProductStock(id: string, stock: number): Promise<{ success: boolean; stock: number }> {
    const res = await fetch(`${API_BASE}/products/${id}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ stock })
    });
    return handleResponse(res);
  },

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // --- COLLECTIONS (GAMMES) ---
  async getCollections(params?: { status?: string; featured?: boolean }): Promise<Collection[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.featured) query.append('featured', 'true');

    const res = await fetch(`${API_BASE}/collections?${query.toString()}`);
    return handleResponse(res);
  },

  async getCollection(idOrSlug: string): Promise<Collection> {
    const res = await fetch(`${API_BASE}/collections/${idOrSlug}`);
    return handleResponse(res);
  },

  async createCollection(data: Partial<Collection>): Promise<{ success: boolean; collection: Collection; message: string }> {
    const res = await fetch(`${API_BASE}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateCollection(id: string, data: Partial<Collection>): Promise<{ success: boolean; collection: Collection; message: string }> {
    const res = await fetch(`${API_BASE}/collections/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteCollection(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/collections/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    return handleResponse(res);
  },

  async createCategory(data: Partial<Category>): Promise<{ success: boolean; category: Category }> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<{ success: boolean; category: Category }> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // --- ORDERS ---
  async createOrder(orderData: any): Promise<{ success: boolean; order: Order; message: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return handleResponse(res);
  },

  async getOrders(params?: { status?: string; search?: string }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/orders?${query.toString()}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async getOrder(id: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async trackOrder(orderNumber: string, phone?: string): Promise<Order> {
    const query = phone ? `?phone=${encodeURIComponent(phone)}` : '';
    const res = await fetch(`${API_BASE}/orders/track/${orderNumber}${query}`);
    return handleResponse(res);
  },

  async updateOrderStatus(id: string, status: string, note?: string, paymentStatus?: string): Promise<{ success: boolean; order: Order }> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status, note, paymentStatus })
    });
    return handleResponse(res);
  },

  // --- CUSTOMERS ---
  async getCustomers(search?: string): Promise<Customer[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(`${API_BASE}/customers${query}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async getCustomer(id: string): Promise<Customer> {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // --- DASHBOARD / SALES ---
  async getDashboardData(): Promise<DashboardData> {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // --- REVIEWS ---
  async getReviews(params?: { productId?: string; status?: string }): Promise<Review[]> {
    const query = new URLSearchParams();
    if (params?.productId) query.append('productId', params.productId);
    if (params?.status) query.append('status', params.status);

    const res = await fetch(`${API_BASE}/reviews?${query.toString()}`);
    return handleResponse(res);
  },

  async createReview(data: Partial<Review>): Promise<{ success: boolean; review: Review; message: string }> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateReviewStatus(id: string, status: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/reviews/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async deleteReview(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // --- SITE CONTENT (CMS) ---
  async getSiteContent(): Promise<SiteContent> {
    const res = await fetch(`${API_BASE}/content`);
    return handleResponse(res);
  },

  async updateSiteContent(data: Partial<SiteContent>): Promise<{ success: boolean; content: SiteContent; message: string }> {
    const res = await fetch(`${API_BASE}/content`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // --- STORE SETTINGS ---
  async getSettings(): Promise<StoreSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    return handleResponse(res);
  },

  async updateSettings(data: Partial<StoreSettings>): Promise<{ success: boolean; settings: StoreSettings; message: string }> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // --- PHOTO UPLOAD & OPTIMIZATION ---
  async uploadSinglePhoto(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/upload/single`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData
    });
    const data = await handleResponse<{ success: boolean; url: string }>(res);
    return data.url;
  },

  async uploadMultiplePhotos(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const res = await fetch(`${API_BASE}/upload/multiple`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData
    });
    const data = await handleResponse<{ success: boolean; urls: string[] }>(res);
    return data.urls;
  }
};

/**
 * Client-side image compression utility before upload
 * Resizes and compresses images to ensure fast uploads even on 3G/4G mobile networks
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.85): Promise<File> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}
