import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import CategoryPageItem from '../../components/CategoryPageItem';

interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryName: string;
}

const CategoryPage = () => {
  const route = useRoute();
  const { categoryName } = route.params as { categoryName: string };
  const decodedCategoryName = decodeURIComponent(categoryName).toLowerCase();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoryDisplayName, setCategoryDisplayName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoriesRes = await fetch('http://strhzy.ru:8080/api/MenuCategories');
        if (!categoriesRes.ok) throw new Error('Ошибка загрузки категорий');
        
        const categories = await categoriesRes.json();
        const category = categories.find(
          (cat) => cat.slug.toLowerCase() === decodedCategoryName
        );

        if (!category) {
          setError('Категория не найдена');
          setLoading(false);
          return;
        }

        setCategoryDisplayName(category.name);

        const itemsRes = await fetch('http://strhzy.ru:8080/api/MenuItems');
        if (!itemsRes.ok) throw new Error('Ошибка загрузки блюд');
        
        const items: MenuItem[] = await itemsRes.json();
        const filteredItems = items.filter(
          (item) => item.categoryId === category.id
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
      onClick={() => {}} // Add onClick function. Now Empty
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoryDisplayName}</Text>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2} // Two columns
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
});

export default CategoryPage;
