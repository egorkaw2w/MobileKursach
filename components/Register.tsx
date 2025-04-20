import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    lastName: '',
    firstName: '',
    middleName: '',
    birthDate: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleShowPasswordChange = () => setShowPassword((prev) => !prev);
  const handleShowConfirmPasswordChange = () => setShowConfirmPassword((prev) => !prev);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBirthDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, birthDate: formattedDate }));
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    const { login, firstName, lastName, middleName, birthDate, phone, email, password, confirmPassword } = formData;

    if (!login || !firstName || !lastName || !middleName || !birthDate || !phone || !email || !password || !confirmPassword) {
      setError('Все поля должны быть заполнены!');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают!');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://strhzy.ru:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login,
          fullName: `${lastName} ${firstName} ${middleName}`.trim(),
          birthDate,
          phone,
          email,
          passwordHash: password,
          roleId: 4,
        }),
      });

      const responseText = await response.text();

      if (response.ok) {
        setTimeout(() => navigation.navigate('Login'), 0);
      } else {
        let errorMessage = 'Что-то пошло не так, попробуйте снова.';
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.message.includes('Логин уже занят')) {
            errorMessage = 'Этот логин уже занят, выберите другой.';
          } else if (errorData.message.includes('Email уже занят')) {
            errorMessage = 'Этот email уже зарегистрирован.';
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          errorMessage = 'Ошибка на сервере, попробуйте позже.';
        }
        setError(errorMessage);
      }
    } catch (err: any) {
      setError('Не удалось подключиться к серверу. Проверьте интернет и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>
        <Text style={styles.title}>Регистрация</Text>

        <View style={styles.registerArea}>
          {error && (
            <View style={styles.notification}>
              <Text style={styles.notificationText}>{error}</Text>
            </View>
          )}
          {success && (
            <View style={styles.notification}>
              <Text style={styles.notificationText}>{success}</Text>
            </View>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Логин"
              placeholderTextColor="#aaa"
              value={formData.login}
              onChangeText={(text) => handleInputChange('login', text)}
            />
          </View>

          <View style={styles.nameGroup}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Фамилия"
                placeholderTextColor="#aaa"
                value={formData.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Имя"
                placeholderTextColor="#aaa"
                value={formData.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Отчество"
                placeholderTextColor="#aaa"
                value={formData.middleName}
                onChangeText={(text) => handleInputChange('middleName', text)}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>
              {formData.birthDate ? formData.birthDate : 'Дата рождения'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.birthDate ? new Date(formData.birthDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleBirthDateChange}
            />
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Номер телефона"
              placeholderTextColor="#aaa"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.passwordBox}>
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor="#aaa"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
            />
            <TouchableOpacity style={styles.showPasswordButton} onPress={handleShowPasswordChange}>
              <Text style={styles.showPasswordText}>{showPassword ? 'Скрыть' : 'Показать'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.passwordBox}>
            <TextInput
              style={styles.input}
              placeholder="Подтверждение пароля"
              placeholderTextColor="#aaa"
              secureTextEntry={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
            />
            <TouchableOpacity style={styles.showPasswordButton} onPress={handleShowConfirmPasswordChange}>
              <Text style={styles.showPasswordText}>{showConfirmPassword ? 'Скрыть' : 'Показать'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerFooter}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.toLoginText}>
                Есть аккаунт? <Text style={styles.toLoginLink}>Войти!</Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Зарегистрироваться</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  registerArea: {
    width: '90%',
    maxWidth: 400,
  },
  inputWrapper: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  input: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 8,
  },
  nameGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingVertical: 8,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
  },
  passwordBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  showPasswordButton: {
    padding: 8,
  },
  showPasswordText: {
    color: '#F3B699',
  },
  registerFooter: {
    marginTop: 24,
    alignItems: 'center',
  },
  toLoginText: {
    color: '#fff',
    marginBottom: 16,
  },
  toLoginLink: {
    color: '#F3B699',
  },
  registerButton: {
    backgroundColor: '#F3B699',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  notification: {
    backgroundColor: '#ff6b6b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  notificationText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Register;
