import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../services/AuthContext';

const Login = () => {
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();

  const handleInputChange = (name: string, value: string) => {
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    const { login: username, password } = loginData;

    if (!username || !password) {
      setError('Введите логин и пароль!');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://strhzy.ru:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: username, password }),
      });

      const responseText = await response.text();

      if (response.ok) {
        const parsedResponse = JSON.parse(responseText);
        const data = parsedResponse.data;

        if (!data || !data.id || !data.fullName) {
          throw new Error('Неверный формат ответа от сервера');
        }

        login({ fullName: data.fullName }, data.id);
        navigation.navigate('Welcome'); // Перенаправление на Welcome
      } else {
        const errorData = JSON.parse(responseText);
        setError(errorData.error || 'Неверный логин или пароль!');
      }
    } catch (err) {
      console.error(err);
      setError('Не удалось подключиться к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          {/* Замените на ваш компонент логотипа */}
          <Text style={styles.logoPlaceholder}>LOGO</Text>
        </View>

        <Text style={styles.title}>Авторизация</Text>

        <View style={styles.loginArea}>
          {error && (
            <View style={styles.notification}>
              <Text style={styles.notificationText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Логин"
              placeholderTextColor="#aaa"
              value={loginData.login}
              onChangeText={(text) => handleInputChange('login', text)}
            />
            <View style={styles.underline} />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={loginData.password}
              onChangeText={(text) => handleInputChange('password', text)}
            />
            <View style={styles.underline} />
          </View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>
              Нет аккаунта? <Text style={styles.registerLinkText}>Зарегистрируйся!</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.loginButtonText}>Авторизоваться</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoPlaceholder: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    color: '#fff',
    marginBottom: 40,
  },
  loginArea: {
    width: '90%',
    maxWidth: 400,
  },
  inputWrapper: {
    marginBottom: 30,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 10,
  },
  underline: {
    height: 2,
    backgroundColor: '#fff',
    width: '100%',
  },
  loginButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  registerLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  registerText: {
    color: '#fff',
  },
  registerLinkText: {
    color: '#F3B699',
  },
  notification: {
    backgroundColor: '#ff6b6b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  notificationText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Login;
