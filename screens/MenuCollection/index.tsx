import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CategoryPage from '../CategoryPage';
interface MenuItemProps {
  ItemText: string;
  ItemLinkTo: string;
}

const MenuItemMobile = ({ ItemText, ItemLinkTo }: MenuItemProps) => {
  const navigation = useNavigation();


  const  CategoryPage = () => {
    navigation.navigate('CategoryPage', { categoryName: ItemLinkTo.split('/').pop() }); // Получение categoryName из ItemLinkTo
  };

  return (
    <TouchableOpacity style={styles.menuItem} onPress={CategoryPage}>
      <Text style={styles.menuItemText}>{ItemText}</Text>
    </TouchableOpacity>
  );
};

const MenuCollection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.menuItemsContainer}>
        <MenuItemMobile ItemText="Закуски" ItemLinkTo="/Menu/zakuski" />
        <MenuItemMobile ItemText="Десерты" ItemLinkTo="/Menu/deserty" />
        <MenuItemMobile ItemText="Горячие блюда" ItemLinkTo="/Menu/goryachie-blyuda" />
        <MenuItemMobile ItemText="Завтраки" ItemLinkTo="/Menu/zavtraki" />
        <MenuItemMobile ItemText="Винная карта" ItemLinkTo="/Menu/vinnaya-karta" />
        <MenuItemMobile ItemText="Барная карта" ItemLinkTo="/Menu/barnaya-karta" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  menuItemsContainer: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 10,
  },
  menuItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default MenuCollection;
