import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchOrders, fetchOrderStatuses, updateOrderStatus, OrderStatus } from '../../services/api';
import { Order } from '../../types';
import { useAuth } from '../../services/AuthContext';
import { useNavigation } from '@react-navigation/native';

const CourierAdminPanel = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isCourierAdmin, logout } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isCourierAdmin()) {
      console.log('Unauthorized access to courier admin');
      navigation.replace('Login');
      return;
    }

    const loadData = async () => {
      try {
        console.log('Loading orders and statuses...');
        const [ordersData, statusesData] = await Promise.all([
          fetchOrders(),
          fetchOrderStatuses(),
        ]);
        console.log('Orders loaded:', ordersData);
        console.log('Statuses loaded:', statusesData);
        setOrders(ordersData);
        setStatuses(statusesData);
      } catch (err: any) {
        console.error('Failed to load data:', err);
        setError(
          err.response?.status === 404
            ? 'Эндпоинт заказов не найден!'
            : `Не удалось загрузить данные: ${err.message}.`
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isCourierAdmin, navigation]);

  const handleStatusChange = async (orderId: number, statusName: string) => {
    try {
      console.log(`Updating status for order ${orderId} to ${statusName}`);
      const updatedOrder = await updateOrderStatus(orderId, statusName);
      console.log('Status updated:', updatedOrder);
      setOrders(orders.map((order) => (order.id === orderId ? updatedOrder : order)));
    } catch (err: any) {
      console.error('Failed to update status:', err);
      setError(`Не удалось обновить статус: ${err.message}.`);
    }
  };

  const handleLogout = () => {
    try {
      console.log('Logging out from courier admin');
      logout();
      navigation.replace('Login');
    } catch (err) {
      console.error('Failed to logout:', err);
      setError('Не удалось выйти.');
    }
  };

  const retryLoad = () => {
    setError(null);
    setLoading(true);
    const loadData = async () => {
      try {
        const [ordersData, statusesData] = await Promise.all([
          fetchOrders(),
          fetchOrderStatuses(),
        ]);
        setOrders(ordersData);
        setStatuses(statusesData);
      } catch (err: any) {
        setError(
          err.response?.status === 404
            ? 'Эндпоинт заказов не найден!'
            : `Не удалось загрузить данные: ${err.message}.`
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1a1a2e" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryLoad}>
          <Text style={styles.retryButtonText}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Управление заказами</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Выйти</Text>
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <Text style={styles.noOrders}>Нет заказов.</Text>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <Text style={styles.orderInfo}>Заказ #{order.id}</Text>
            <Text style={styles.orderInfo}>
              Клиент: {order.user?.fullName ?? 'Неизвестный клиент'}
            </Text>
            <Text style={styles.orderInfo}>
              Телефон: {order.user?.phone ?? 'Нет телефона'}
            </Text>
            <Text style={styles.orderInfo}>
              Адрес: {order.address?.addressText ?? 'Нет адреса'}
            </Text>
            <Text style={styles.orderInfo}>Общая сумма: {order.totalPrice} ₽</Text>
            <Text style={styles.orderInfo}>Статус: {order.status}</Text>
            <Text style={styles.orderInfo}>
              Создан: {new Date(order.createdAt).toLocaleString()}
            </Text>
            <Text style={styles.orderInfo}>Элементы заказа:</Text>
            {order.orderItems.length === 0 ? (
              <Text style={styles.orderItem}>Нет элементов заказа</Text>
            ) : (
              order.orderItems.map((item) => (
                <Text key={item.id} style={styles.orderItem}>
                  - {item.menuItem?.name ?? 'Неизвестный товар'} (x{item.quantity}):{' '}
                  {item.priceAtOrder} ₽
                </Text>
              ))
            )}

            <Picker
              selectedValue={order.status}
              onValueChange={(itemValue) => handleStatusChange(order.id, itemValue)}
              style={styles.picker}
            >
              {statuses.map((status) => (
                <Picker.Item
                  key={status.id}
                  label={status.name}
                  value={status.name}
                />
              ))}
            </Picker>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderInfo: {
    fontSize: 16,
    marginBottom: 8,
  },
  orderItem: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 4,
  },
  picker: {
    height: 50,
    width: '100%',
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  noOrders: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  retryButton: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CourierAdminPanel;