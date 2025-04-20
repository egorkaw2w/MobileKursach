typescript
export interface Order {
  id: number;
  userId: number;
  addressId: number;
  totalPrice: number;
  status: string; // Теперь строка, а не объект OrderStatus
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  address: {
    id: number;
    addressText: string;
  };
  user: {
    id: number;
    fullName: string;
    phone: string;
  };
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  quantity: number;
  priceAtOrder: number;
  menuItem: {
    id: number;
    name: string;
  };
}
