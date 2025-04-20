import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: height * 0.1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  authButton: {
    position: 'absolute',
    top: height * 0.1 + 10,
    right: 16,
    zIndex: 100,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  navContainer: {
    width: width * 0.8,
    alignSelf: 'center',
  },
  navButtons: {
    marginBottom: 24,
  },
  navButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 50,
    paddingVertical: 16,
    marginVertical: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  dateInfo: {
    alignItems: 'center',
    marginTop: 30,
  },
  dateText: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 4,
    fontWeight: '600',
  },
  timeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  notification: {
    position: 'absolute',
    top: height * 0.1 + 50,
    right: 16,
    backgroundColor: '#ff6b6b',
    padding: 12,
    borderRadius: 8,
  },
  notificationText: {
    color: '#fff',
    fontSize: 14,
  },
});
