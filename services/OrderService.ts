import axios from 'axios';
import { Order, OrderStatus } from './types'; // Укажите правильный путь

const API_URL = 'http://ваш-сервер/api';

// Кэширование статусов
let cachedStatuses: OrderStatus[] | null = null;

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get<Order[]>(`${API_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error);
    throw new Error('Не удалось загрузить заказы');
  }
};

export const fetchOrderStatuses = async (): Promise<OrderStatus[]> => {
  try {
    if (cachedStatuses) {
      return cachedStatuses;
    }
    const response = await axios.get<OrderStatus[]>(`${API_URL}/order-statuses`);
    cachedStatuses = response.data;
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки статусов:', error);
    throw new Error('Не удалось загрузить статусы');
  }
};

export const updateOrderStatus = async (
  orderId: number,
  statusId: number
): Promise<Order> => {
  try {
    const response = await axios.patch<Order>(
      `${API_URL}/orders/${orderId}`,
      { statusId },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    throw new Error('Не удалось обновить статус заказа');
  }
};
