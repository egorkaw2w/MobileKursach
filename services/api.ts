import axios from 'axios';
import { Order, OrderStatus } from '../types';

const API_URL = 'http://strhzy.ru:8080/api'; // Укажите ваш реальный API

// Настройка интерсептора для логирования ошибок
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios error:', error.response?.data, error.message);
    return Promise.reject(error);
  }
);

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
  status: string
): Promise<Order> => {
  try {
    const response = await axios.patch<Order>(
      `${API_URL}/orders/${orderId}`,
      { status },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    throw new Error('Не удалось обновить статус заказа');
  }
};