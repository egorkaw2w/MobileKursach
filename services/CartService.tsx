import axios from 'axios';

interface CartItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  menuItemPrice: number;
  quantity: number;
  menuItemDescription?: string;
}

interface CartResponse {
  id: number;
  userId: number;
  cartItems: CartItem[];
}

const API_URL = 'http://strhzy.ru:8080/api';

export const getOrCreateCart = async (userId: number): Promise<CartResponse> => {
  try {
    console.log('[CartService] Fetching cart for userId:', userId);
    const response = await axios.get(`${API_URL}/Carts?userId=${userId}`);
    const carts = response.data;
    if (carts.length > 0) {
      console.log('[CartService] Existing cart found:', carts[0]);
      return carts[0];
    }

    console.log('[CartService] Creating cart for userId:', userId);
    const newCartResponse = await axios.post<CartResponse>(
      `${API_URL}/Carts`,
      { userId },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('[CartService] Cart created:', newCartResponse.data);
    return newCartResponse.data;
  } catch (error: any) {
    console.error('[CartService] Error:', error);
    if (error.response) {
      console.error('[CartService] Server response:', JSON.stringify(error.response.data, null, 2));
      const errorMessage = error.response.data.message || 
        (error.response.data.errors && Object.values(error.response.data.errors).flat().join('; ')) || 
        'Ошибка при создании корзины';
      throw new Error(errorMessage);
    }
    throw new Error('Не удалось получить или создать корзину');
  }
};

export const getCartItems = async (cartId: number): Promise<CartItem[]> => {
  try {
    console.log('[CartService] Fetching cart items for cartId:', cartId);
    const response = await axios.get<CartItem[]>(`${API_URL}/CartItems?cartId=${cartId}`);
    console.log('[CartService] Cart items fetched:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[CartService] Error fetching cart items:', error);
    throw new Error('Ошибка загрузки корзины');
  }
};

export const addToCart = async (
  cartId: number,
  menuItemId: number,
  quantity: number = 1
): Promise<CartItem> => {
  try {
    console.log(`[CartService] Adding item to cart ${cartId}:`, { menuItemId, quantity });
    const response = await axios.post<CartItem>(
      `${API_URL}/CartItems`,
      { cartId, menuItemId, quantity, createdAt: new Date().toISOString() },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('[CartService] Item added:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[CartService] Error adding item:', error);
    if (error.response) {
      console.error('[CartService] Server response:', JSON.stringify(error.response.data, null, 2));
      const errorMessage = error.response.data.message || 
        (error.response.data.errors && Object.values(error.response.data.errors).flat().join('; ')) || 
        'Ошибка добавления товара';
      throw new Error(errorMessage);
    }
    throw new Error('Ошибка добавления товара');
  }
};

export const updateCartItemQuantity = async (
  itemId: number,
  newQuantity: number
): Promise<void> => {
  try {
    console.log(`[CartService] Updating quantity for item ${itemId}:`, newQuantity);
    await axios.put(
      `${API_URL}/CartItems/${itemId}`,
      { id: itemId, quantity: newQuantity },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('[CartService] Quantity updated');
  } catch (error: any) {
    console.error('[CartService] Error updating quantity:', error);
    throw new Error('Ошибка обновления количества');
  }
};

export const removeFromCart = async (itemId: number): Promise<void> => {
  try {
    console.log(`[CartService] Removing item ${itemId}`);
    await axios.delete(`${API_URL}/CartItems/${itemId}`);
    console.log('[CartService] Item removed');
  } catch (error: any) {
    console.error('[CartService] Error removing item:', error);
    throw new Error('Ошибка удаления товара');
  }
};

export const clearCart = async (cartId: number): Promise<void> => {
  try {
    console.log(`[CartService] Clearing cart ${cartId}`);
    await axios.delete(`${API_URL}/CartItems?cartId=${cartId}`);
    console.log('[CartService] Cart cleared');
  } catch (error: any) {
    console.error('[CartService] Error clearing cart:', error);
    throw new Error('Ошибка очистки корзины');
  }
};

export const getTotalCartItems = async (cartId: number): Promise<number> => {
  try {
    console.log(`[CartService] Calculating total items for cart ${cartId}`);
    const items = await getCartItems(cartId);
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    console.log('[CartService] Total items:', total);
    return total;
  } catch (error: any) {
    console.error('[CartService] Error calculating total items:', error);
    throw new Error('Ошибка подсчета товаров');
  }
};