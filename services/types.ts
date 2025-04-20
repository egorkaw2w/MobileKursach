export interface Order {
    id: number;
    userId: number;
    addressId: number;
    totalPrice: number;
    status: OrderStatus; // Теперь это объект
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
  
  export interface OrderStatus {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
  