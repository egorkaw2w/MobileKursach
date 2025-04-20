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
      <Stack.Navigator initialRouteName={isCourierAdmin() ? 'CourierAdmin' : 'Welcome'}>
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
              name="MainApp"
              component={MainAppRouter}
              options={{ headerShown: false }}
            />
            {/* Добавляем CourierAdmin для навигации, если потребуется */}
            <Stack.Screen
              name="CourierAdmin"
              component={CourierAdminPanel}
              options={{
                title: 'Панель курьера',
                headerStyle: { backgroundColor: '#1a1a2e' },
                headerTintColor: '#fff',
              }}
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