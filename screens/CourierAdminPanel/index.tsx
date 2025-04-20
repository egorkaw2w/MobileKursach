import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../services/AuthContext';
import { 
  fetchOrders, 
  updateOrderStatus, 
  fetchOrderStatuses,
  Order
} from '../services/OrderService';

const CourierAdminPanel: React.FC = ({ navigation }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isCourierAdmin, logout } = useAuth();

  useEffect(() => {
    const checkAccess = () => {
      if (!isCourierAdmin()) {
        Alert.alert('Доступ запрещен', 'Вы будете перенаправлены');
        navigation.navigate('MainApp');
        return false;
      }
      return true;
    };

    if (!checkAccess()) return;

    const loadData = async () => {
      try {
        const [ordersData, statusesData] = await Promise.all([
          fetchOrders(),
          fetchOrderStatuses()
        ]);

        setStatuses(statusesData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        Alert.alert('Ошибка', 'Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStatusChange = async (orderId: number, statusId: number) => {
    try {
      await updateOrderStatus(orderId, statusId);
      
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: statuses.find(s => s.id === statusId) } 
          : order
      ));
      
      Alert.alert('Успех', 'Статус обновлен');
    } catch (error) {
      console.error('Ошибка обновления:', error);
      Alert.alert('Ошибка', 'Не удалось обновить статус');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Панель управления курьера</Text>
      
      {orders.map(order => (
        <View key={order.id} style={styles.orderCard}>
          <Text style={styles.orderNumber}>Заказ №{order.id}</Text>
          
          <View style={styles.section}>
            <Text style={styles.label}>Клиент:</Text>
            <Text>{order.user.fullName}</Text>
            <Text>{order.user.phone}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Адрес:</Text>
            <Text>{order.address.addressText}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Статус:</Text>
            <Picker
              selectedValue={order.status.id}
              onValueChange={(value) => handleStatusChange(order.id, value)}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              {statuses.map(status => (
                <Picker.Item
                  key={status.id}
                  label={status.name}
                  value={status.id}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Товары:</Text>
            {order.orderItems.map(item => (
              <View key={item.id} style={styles.productItem}>
                <Text>{item.menuItem.name} x {item.quantity}</Text>
                <Text>{item.priceAtOrder} ₽</Text>
              </View>
            ))}
          </View>

          <View style={styles.total}>
            <Text style={styles.totalText}>Итого: {order.totalPrice} ₽</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f6fa',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center'
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#34495e'
  },
  section: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1'
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#7f8c8d'
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  total: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1'
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right'
  },
  picker: {
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    marginTop: 5
  }
});

export default CourierAdminPanel;
