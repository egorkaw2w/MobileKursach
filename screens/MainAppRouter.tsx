// screens/MainAppRouter.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MenuCollection from './MenuCollection';
import CategoryPage from './CategoryPage';
import Bin from './Bin';

const Stack = createStackNavigator();

const MainAppRouter = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MenuCollection" 
        component={MenuCollection} 
        options={{ 
          title: 'Меню',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="CategoryPage" 
        component={CategoryPage} 
        options={{ 
          title: 'Категория',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="Bin" 
        component={Bin} 
        options={{ 
          title: 'Корзина',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainAppRouter;
