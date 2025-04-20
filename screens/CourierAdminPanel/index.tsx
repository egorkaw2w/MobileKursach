import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchOrders, fetchOrderStatuses, updateOrderStatus } from '../../services/api';
import { Order, OrderStatus } from '../../types';

const CourierAdminPanel = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, statusesData] = await Promise.all([
 
          fetchOrders(),
          fetchOrderStatuses(),
        ]);
        setOrders(ordersData);
        setStatuses(statusesData);
      } catch (err) {
        setError('Не удалось загрузить данные');
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStatusChange = async (orderId: number, statusName: string) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, statusName);
      setOrders(orders.map((order) =>
        order.id === orderId ? updatedOrder : order
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Не удалось обновить статус');
    }
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
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Управление заказами</Text>

      {orders.length === 0 ? (
        <Text style={styles.noOrders}>Нет заказов</Text>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <Text style={styles.orderInfo}>Заказ #{order.id}</Text>
            <Text style={styles.orderInfo}>Клиент: {order.user.fullName}</Text>
            <Text style={styles.orderInfo}>Телефон: {order.user.phone}</Text>
            <Text style={styles.orderInfo}>Адрес: {order.address.addressText}</Text>
            <Text style={styles.orderInfo}>Общая сумма: {order.totalPrice} ₽</Text>
            <Text style={styles.orderInfo}>Статус: {order.status}</Text>
            <Text style={styles.orderInfo}>Создан: {new Date(order.createdAt).toLocaleString()}</Text>
            <Text style={styles.orderInfo}>Элементы заказа:</Text>
            {order.orderItems.map((item) => (
              <Text key={item.id} style={styles.orderItem}>
                - {item.menuItem.name} (x{item.quantity}): {item.priceAtOrder} ₽
              </Text>
            ))}

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  },
  noOrders: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CourierAdminPanel;