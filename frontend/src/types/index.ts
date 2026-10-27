export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  position: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  categoryId: string;
  collectionId?: string;
  description: string;
  shortDescription: string;
  price: number;
  oldPrice?: number;
  promoPrice?: number;
  stock: number;
  alertThreshold: number;
  shade?: string;
  skinType?: string;
  ingredients?: string;
  images: ProductImage[];
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  status: 'published' | 'draft' | 'hidden';
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shade: string;
  description: string;
  shortDescription?: string;
  coverImage: string;
  images: string[];
  status: 'active' | 'inactive';
  isFeatured: boolean;
  productCount?: number;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount?: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  shade?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  shade?: string;
  image: string;
  sku?: string;
}

export interface OrderHistoryEntry {
  status: string;
  date: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    region: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'cash_on_delivery' | 'wave' | 'orange_money' | 'card';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'new' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  history: OrderHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  createdAt: string;
  orders?: Order[];
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    ctaText: string;
    ctaLink: string;
    bgImage: string;
  };
  promoBanner: {
    enabled: boolean;
    text: string;
    linkText: string;
    linkUrl: string;
  };
  about: {
    title: string;
    subtitle: string;
    paragraph1: string;
    paragraph2: string;
    storyImage: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    city: string;
    instagram: string;
    tiktok: string;
    facebook: string;
    openingHours: string;
  };
  guarantees: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface StoreSettings {
  storeName: string;
  currency: string;
  currencySymbol: string;
  phone: string;
  whatsapp: string;
  email: string;
  freeDeliveryThreshold: number;
  deliveryFees: Array<{
    region: string;
    fee: number;
  }>;
  lowStockThreshold: number;
  enableSoundNotifications: boolean;
  wavePaymentUrl?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'manager';
  avatar?: string;
}

export interface SalesSummary {
  totalRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  totalOrders: number;
  validOrdersCount: number;
  todayOrdersCount: number;
  weekOrdersCount: number;
  monthOrdersCount: number;
  totalProductsSold: number;
  totalProductsInCatalog: number;
  averageCart: number;
  customersCount: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface DashboardData {
  summary: SalesSummary;
  lowStockProducts: Product[];
  outOfStockProducts: Product[];
  topProducts: Array<{ name: string; sku?: string; count: number; revenue: number; image: string }>;
  topCollections: Array<{ name: string; count: number; revenue: number }>;
  last7DaysChart: Array<{ label: string; date: string; revenue: number; ordersCount: number }>;
  ordersByStatus: {
    new: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  recentOrders: Order[];
}
