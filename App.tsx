import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './services/AuthContext';
import WelcomeImage from './screens/WelcomeImage';
import Login from './components/Login';
import Register from './components/Register';
import MainAppRouter from './screens/MainAppRouter';
import CourierAdminPanel from './screens/CourierAdminPanel';
import MenuCollection from './screens/MenuCollection';
import CategoryPage from './screens/CategoryPage';
import Bin from './screens/Bin';

const Stack = createStackNavigator();

const AppRouter = () => {
  const { isAuthReady, isCourierAdmin } = useAuth();

  if (!isAuthReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1a1a2e" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isCourierAdmin() ? (
          <Stack.Screen
            name="CourierAdmin"
            component={CourierAdminPanel}
            options={{
              title: 'Панель курьера',
              headerStyle: { backgroundColor: '#1a1a2e' },
              headerTintColor: '#fff',
            }}
          />
        ) : (
          <>
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
              name="Register"
              component={Register}
              options={{
                title: 'Регистрация',
                headerStyle: { backgroundColor: '#1a1a2e' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="MenuCollection"
              component={MenuCollection}
              options={{
                title: 'MenuCollection',
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
            <Stack.Screen
              name="MainApp"
              component={MainAppRouter}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;