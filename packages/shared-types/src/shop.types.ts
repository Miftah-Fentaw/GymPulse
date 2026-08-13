export interface Product {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  quantity_in_stock: number;
  images: string[];
  tags: string[];
  is_featured: boolean;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  total_amount: number;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}
