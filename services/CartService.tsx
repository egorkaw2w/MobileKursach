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
    console.log('[CartService] Creating cart for userId:', userId);
    const response = await axios.post<CartResponse>(
      `${API_URL}/Carts`,
      { userId },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('[CartService] Cart created:', response.data);
    return response.data;
  } catch (error) {
    console.error('[CartService] Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка при создании корзины');
  }
};

export const getCartItems = async (cartId: number): Promise<CartItem[]> => {
  try {
    const response = await axios.get<CartItem[]>(
      `${API_URL}/Carts/${cartId}/items`
    );
    return response.data;
  } catch (error) {
    console.error('[CartService] Error:', error.response?.data || error.message);
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
      `${API_URL}/Carts/${cartId}/items`,
      { menuItemId, quantity },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('[CartService] Item added:', response.data);
    return response.data;
  } catch (error) {
    console.error('[CartService] Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ошибка добавления товара');
  }
};

export const updateCartItemQuantity = async (
  itemId: number,
  newQuantity: number
): Promise<void> => {
  try {
    await axios.put(
      `${API_URL}/CartItems/${itemId}`,
      { quantity: newQuantity }
    );
  } catch (error) {
    console.error('[CartService] Error:', error.response?.data || error.message);
    throw new Error('Ошибка обновления количества');
  }
};

export const removeFromCart = async (itemId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/CartItems/${itemId}`);
  } catch (error) {
    console.error('[CartService] Error:', error.response?.data || error.message);
    throw new Error('Ошибка удаления товара');
  }
};

export const clearCart = async (cartId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/Carts/${cartId}/items`);
  } catch (error) {
    console.error('[CartService] Error:', error.response?.data || error.message);
    throw new Error('Ошибка очистки корзины');
  }
};

export const getTotalCartItems = async (cartId: number): Promise<number> => {
  try {
    const items = await getCartItems(cartId);
    return items.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.error('[CartService] Error:', error.response?.data || error.message);
    throw new Error('Ошибка подсчета товаров');
  }
};
