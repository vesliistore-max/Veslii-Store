export type ProductCategory = 'watches' | 'wallets' | 'serum';

export interface ProductVariant {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  image: string;
  sku: string;
  stock: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  city?: string;
  rating: number; // 1 - 5
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  shortDescription: string;
  description: string;
  price: number; // in PKR
  originalPrice?: number; // in PKR for sales
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  images: string[];
  variants: ProductVariant[];
  specs: ProductSpec[];
  highlights: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  category: ProductCategory;
  variantName: string;
  colorName: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  stock: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode?: string;
  deliveryNotes?: string;
}

export type PaymentMethod = 'cod' | 'bank_transfer';

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  estimatedDelivery: string;
}

export interface FilterState {
  category?: ProductCategory | 'all';
  priceRange: [number, number];
  color?: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest' | 'rating';
  inStockOnly: boolean;
  strapMaterial?: string;
  walletStyle?: string;
}
