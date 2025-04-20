import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  StyleSheet,
  Modal
} from 'react-native';
import { useAuth } from "../../services/AuthContext";
import {
  getOrCreateCart,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
} from "../../services/CartService";

const Bin: React.FC = () => {
  const { userId } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        setError("Требуется авторизация");
        setLoading(false);
        return;
      }

      try {
        console.log('[Bin] Fetching cart for userId:', userId);
        const cart = await getOrCreateCart(userId);
        console.log('[Bin] Cart received:', cart);
        setCartId(cart.id);
        const items = await getCartItems(cart.id);
        console.log('[Bin] Cart items received:', items);
        setCartItems(items);
      } catch (err: any) {
        console.error('[Bin] Error fetching cart:', err);
        setError(err.message || "Ошибка загрузки корзины");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  const handleRemoveItem = async (itemId: number) => {
    try {
      console.log('[Bin] Removing item:', itemId);
      await removeFromCart(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      Alert.alert('Успех', 'Товар удалён из корзины');
    } catch (err: any) {
      console.error('[Bin] Error removing item:', err);
      Alert.alert('Ошибка', err.message || 'Не удалось удалить товар');
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      console.log('[Bin] Updating quantity for item:', itemId, 'to:', newQuantity);
      await updateCartItemQuantity(itemId, newQuantity);
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err: any) {
      console.error('[Bin] Error updating quantity:', err);
      Alert.alert('Ошибка', err.message || 'Не удалось обновить количество');
    }
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
    Alert.alert('Успех', 'Заказ успешно оформлен!');
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.menuItemPrice * item.quantity),
    0
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Ваша корзина</Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Корзина пустая.. Заполним её?</Text>
          <Image
            style={styles.emptyImage}
            source={{uri: 'https://cdn-icons-png.flaticon.com/512/2037/2037453.png'}}
          />
        </View>
      ) : (
        <>
          {cartItems.map(item => (
            <View key={item.id} style={styles.itemContainer}>
              <Image
                style={styles.itemImage}
                source={{
                  uri: item.menuItemId
                    ? `http://strhzy.ru:8080/api/MenuItems/image/${item.menuItemId}`
                    : 'https://via.placeholder.com/100'
                }}
              />

              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.menuItemName}</Text>
                <Text style={styles.itemDescription}>
                  {item.menuItemDescription || "Описание отсутствует"}
                </Text>
                <Text style={styles.itemPrice}>
                  {(item.menuItemPrice * item.quantity).toFixed(2)} ₽
                </Text>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Text style={styles.quantityText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityValue}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Text style={styles.quantityText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.id)}
              >
                <Text style={styles.removeIcon}>×</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Итого: {totalPrice.toFixed(2)} ₽</Text>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => setIsCheckoutOpen(true)}
            >
              <Text style={styles.checkoutButtonText}>Оформить заказ</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal
        visible={isCheckoutOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCheckoutOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Подтверждение заказа</Text>
            
            <Text style={styles.modalText}>
              Вы уверены, что хотите оформить заказ на сумму {totalPrice.toFixed(2)} ₽?
            </Text>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleCheckoutSuccess}
            >
              <Text style={styles.buttonText}>Подтвердить</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsCheckoutOpen(false)}
            >
              <Text style={styles.cancelText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#95a5a6',
    marginTop: 20,
  },
  emptyImage: {
    width: 100,
    height: 100,
    opacity: 0.5,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  itemDescription: {
    fontSize: 13,
    color: '#7f8c8d',
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#27ae60',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 15,
  },
  quantityText: {
    fontSize: 18,
    color: '#2c3e50',
  },
  quantityValue: {
    marginHorizontal: 10,
    fontSize: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 5,
    marginLeft: 10,
  },
  removeIcon: {
    fontSize: 24,
    color: '#e74c3c',
  },
  totalContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  totalText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  checkoutButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    padding: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Bin;