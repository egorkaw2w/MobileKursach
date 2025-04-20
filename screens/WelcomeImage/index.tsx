import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Modal,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../services/AuthContext';

const { height } = Dimensions.get('window');

const WelcomeImage = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const handleAuth = () => {
    if (!user) {
      navigation.navigate('Login');
    }
  };

  const handleMenuPress = () => {
    navigation.navigate('MenuCollection');
  };

  const handleBookingPress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleAction = (action: 'Bin' | 'logout') => {
    setDropdownVisible(false);
    if (action === 'Bin') {
      navigation.navigate('Bin');
    } else {
      logout();
      navigation.navigate('Welcome');
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://sun9-68.userapi.com/impg/M_4khuP5JtHKp-KdfzkYrcqMJSvxpgqpTYuaUg/M8smMhHkvGo.jpg?size=1280x707&quality=95&sign=9a30aa7be4ee97c0fbe8bd90e7539ea9&type=album',
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {user ? (
          <TouchableOpacity 
            style={styles.authButton} 
            onPress={toggleDropdown}
          >
            <Text style={styles.authButtonText}>
              {user.fullName}
            </Text>
            {dropdownVisible && (
              <View style={styles.dropdown}>
                <TouchableOpacity 
                  style={styles.dropdownItem}
                  onPress={() => handleAction('Bin')}
                >
                  <Text style={styles.dropdownText}>Корзина</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dropdownItem}
                  onPress={() => handleAction('logout')}
                >
                  <Text style={styles.dropdownText}>Выйти</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.authButton} 
            onPress={handleAuth}
          >
            <Text style={styles.authButtonText}>Авторизоваться</Text>
          </TouchableOpacity>
        )}

        <View style={{ flex: 1, paddingTop: height * 0.1, paddingBottom: height * 0.1 }} />

        <View style={styles.navContainer}>
          <View style={styles.navButtons}>
            <TouchableOpacity style={styles.navButton} onPress={handleBookingPress}>
              <Text style={styles.navButtonText}>Забронировать</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} onPress={handleMenuPress}>
              <Text style={styles.navButtonText}>Меню</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateInfo}>
            <Text style={styles.dateText}>ПН-ВС</Text>
            <Text style={styles.timeText}>Круглосуточно</Text>
          </View>
        </View>

        {notification && (
          <View style={styles.notification}>
            <Text style={styles.notificationText}>{notification}</Text>
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              <Text style={modalStyles.modalText}>При бронировании позвоните нам:</Text>
              <Text style={modalStyles.phoneNumber}>+7 (123) 456-78-90</Text>
              <TouchableOpacity style={modalStyles.button} onPress={closeModal}>
                <Text style={modalStyles.buttonText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: 30,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  authButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 5,
    padding: 10,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  navContainer: {
    marginBottom: height * 0.1,
    alignItems: 'center',
  },
  navButtons: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  navButton: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  navButtonText: {
    fontSize: 20,
    color: '#333',
  },
  dateInfo: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 24,
    color: 'white',
  },
  timeText: {
    fontSize: 18,
    color: 'white',
  },
  notification: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,0,0,0.8)',
    padding: 10,
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  phoneNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WelcomeImage;
