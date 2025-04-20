import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './services/AuthContext';
import WelcomeImage from './screens/WelcomeImage';
import Login from './components/Login'; // Позже перенесём в screens
import Register from './components/Register'; // Позже перенесём в screens
import MenuCollection from './screens/MenuCollection';
import CategoryPage from './screens/CategoryPage';
import Bin from './screens/Bin';


const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeImage} 
            options={{ headerShown: false }}
          />
          
          <Stack.Screen 
            name="Login" 
            component={Login} 
            options={{ 
              title: 'Авторизация',
              headerStyle: { backgroundColor: '#1a1a2e' },
              headerTintColor: '#fff',
            }}
          />
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
              title: 'CategoryPage',
              headerStyle: { backgroundColor: '#1a1a2e' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen 
            name="Bin" 
            component={Bin} 
            options={{ 
              title: 'Bin',
              headerStyle: { backgroundColor: '#1a1a2e' },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
