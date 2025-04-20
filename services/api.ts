import axios from 'axios'; // Исправлено: убрано 'sturdy '
import { Order, OrderStatus } from '../types';

const API_URL = 'http://strhzy.ru:8080/api';

// Хардкод статусов
export const ORDER_STATUSES: OrderStatus[] = [
  { id: 1, name: 'Новый' },
  { id: 2, name: 'В обработке' },
  { id: 3, name: 'Доставлен' },
  { id: 4, name: 'Отменен' },
];

// Настройка интерсептора для логирования ошибок
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios error, you son of a dead whore:', error.response?.data, error.message);
    return Promise.reject(error);
  }
);

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    console.log('Fetching orders from:', `${API_URL}/orders`);
    const response = await axios.get<Order[]>(`${API_URL}/orders`);
    console.log('Orders loaded:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error);
    throw new Error('Не удалось загрузить заказы');
  }
};

export const fetchOrderStatuses = async (): Promise<OrderStatus[]> => {
  try {
    console.log('Returning hardcoded order statuses:', ORDER_STATUSES);
    return ORDER_STATUSES;
  } catch (error) {
    console.error('Ошибка загрузки статусов:', error);
    throw new Error('Не удалось загрузить статусы');
  }
};

export const updateOrderStatus = async (
  orderId: number,
  status: string
): Promise<Order> => {
  try {
    console.log(`Updating status for order ${orderId} to ${status}`);
    const response = await axios.patch<Order>(
      `${API_URL}/orders/${orderId}/status`,
      { status },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Status updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    throw new Error('Не удалось обновить статус заказа');
  }
};