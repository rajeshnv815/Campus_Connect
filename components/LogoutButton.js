import React from 'react';
import { Button,StyleSheet,View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase/index'; 
import AuthContext from '../firebase/AuthContext';

const LogoutButton = () => {
  const navigation = useNavigation();
  const { setIsLoggedIn } = React.useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} color="#E57373" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#FFF3E0',  // A light-orange background for the button
  },
});
export default LogoutButton;
