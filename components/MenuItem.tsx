import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

type MenuItem = {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryName: string;
};

const CategoryPage = () => {
  const route = useRoute();
  const { categoryName } = route.params as { categoryName: string };
  const decodedCategoryName = decodeURIComponent(categoryName).toLowerCase();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoryDisplayName, setCategoryDisplayName] = useState<string>('');
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoriesRes = await fetch('http://strhzy.ru:8080/api/MenuCategories');
        if (!categoriesRes.ok) throw new Error('Ошибка загрузки категорий');
        
        const categories = await categoriesRes.json();
        const category = categories.find(
          (cat: { slug: string }) => cat.slug.toLowerCase() === decodedCategoryName
        );

        if (!category) {
          setError('Категория не найдена');
          setLoading(false);
          return;
        }

        setCategoryDisplayName(category.name);

        const itemsRes = await fetch('http://strhzy.ru:8080/api/MenuItems');
        if (!itemsRes.ok) throw new Error('Ошибка загрузки блюд');
        
        const items = await itemsRes.json();
        const filteredItems = items.filter(
          (item: MenuItem) => item.categoryId === category.id
        );

        setMenuItems(filteredItems);
        setLoading(false);
      } catch (err: any) {
        setError('Не удалось загрузить данные. Попробуйте позже.');
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryName]);

  const openModal = (item: MenuItem) => {
    setSelectedFood(item);
  };

  const closeModal = () => {
    setSelectedFood(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: MenuItem }) => (
    <CategoryPageItem
      img={item.imageUrl || 'https://via.placeholder.com/150'}
      foodName={item.name}
      foodCost={item.price.toFixed(2)}
      foodDesc={item.description || 'Описание отсутствует'}
      onClick={() => openModal(item)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {categoryDisplayName.charAt(0).toUpperCase() + categoryDisplayName.slice(1)}
      </Text>

      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>В этой категории пока нет блюд. Повар спит?</Text>
        }
      />

      {selectedFood && (
        <FoodModal
          FoodName={selectedFood.name}
          FoodeDescription={selectedFood.description || 'Без описания'}
          FoodImage={selectedFood.imageUrl || 'https://via.placeholder.com/150'}
          FoodPrice={selectedFood.price.toFixed(2)}
          FoodId={selectedFood.id}
          onClose={closeModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

// Компоненты CategoryPageItem и FoodModal (примеры)
const CategoryPageItem = ({ img, foodName, foodCost, foodDesc, onClick }: any) => (
  <TouchableOpacity style={itemStyles.container} onPress={onClick}>
    <Image source={{ uri: img }} style={itemStyles.image} />
    <Text style={itemStyles.name}>{foodName}</Text>
    <Text style={itemStyles.price}>{foodCost} ₽</Text>
    <Text style={itemStyles.description}>{foodDesc}</Text>
  </TouchableOpacity>
);

const itemStyles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    color: '#2ecc71',
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

const FoodModal = ({ FoodName, FoodeDescription, FoodImage, FoodPrice, onClose }: any) => (
  <View style={modalStyles.overlay}>
    <View style={modalStyles.container}>
      <Image source={{ uri: FoodImage }} style={modalStyles.image} />
      <Text style={modalStyles.title}>{FoodName}</Text>
      <Text style={modalStyles.description}>{FoodeDescription}</Text>
      <Text style={modalStyles.price}>{FoodPrice} ₽</Text>
      <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
        <Text style={modalStyles.closeText}>Закрыть</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const modalStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#27ae60',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  closeText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default CategoryPage;
