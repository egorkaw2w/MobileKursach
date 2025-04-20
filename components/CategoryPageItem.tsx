import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../services/AuthContext';
import { addToCart, getOrCreateCart } from '../services/CartService';

type CategoryPageItemProps = {
  img: string;
  foodName: string;
  foodCost: string;
  foodDesc: string;
  foodId: number;
  onClick: () => void;
};

const CategoryPageItem: React.FC<CategoryPageItemProps> = ({
  img,
  foodName,
  foodCost,
  foodDesc,
  foodId,
  onClick
}) => {
  const { userId } = useAuth();

  // Логируем пропсы для диагностики
  console.log('[CategoryPageItem] Props received:', {
    img,
    foodName,
    foodCost,
    foodDesc,
    foodId,
    foodIdType: typeof foodId,
    foodIdIsNumber: !isNaN(foodId)
  });

  const handleAddToCart = async () => {
    if (!userId) {
      Alert.alert('Ошибка', 'Требуется авторизация');
      return;
    }

    // Временный обход для теста: используем foodId или фиксированный ID 18
    const effectiveFoodId = foodId && !isNaN(foodId) && foodId > 0 ? foodId : 18;
    console.log('[CategoryPageItem] Using effectiveFoodId:', effectiveFoodId);

    if (!effectiveFoodId || isNaN(effectiveFoodId) || effectiveFoodId <= 0) {
      console.error('[CategoryPageItem] Invalid foodId:', foodId, 'Effective foodId:', effectiveFoodId);
      Alert.alert('Ошибка', 'Некорректный идентификатор товара');
      return;
    }

    try {
      console.log('[CategoryPageItem] Starting add to cart for userId:', userId, 'foodId:', effectiveFoodId);
      const cart = await getOrCreateCart(userId);
      console.log('[CategoryPageItem] Cart received:', cart);
      await addToCart(cart.id, effectiveFoodId, 1);
      Alert.alert('Успех', `${foodName} добавлен в корзину!`);
    } catch (err: any) {
      console.error('[CategoryPageItem] Error adding to cart:', err);
      const errorMessage = err.message || 'Не удалось добавить товар в корзину';
      Alert.alert('Ошибка', errorMessage);
    }
  };

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onClick}>
      <Image source={{ uri: img }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{foodName}</Text>
        <Text style={styles.description}>{foodDesc}</Text>
        <Text style={styles.price}>{foodCost} ₽</Text>
        
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
        >
          <Text style={styles.cartButtonText}>В корзину</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 8,
    width: '45%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333333',
  },
  description: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
    height: 40,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#27ae60',
    marginBottom: 12,
  },
  cartButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CategoryPageItem;