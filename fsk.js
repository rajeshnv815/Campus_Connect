import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerLeft: null }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const userData = await AsyncStorage.getItem(email);
      if (userData) {
        const { password: storedPassword } = JSON.parse(userData);
        if (password === storedPassword) {
          console.log('Login Successful');
          setError('');
          navigation.navigate('Dashboard', { userData: JSON.parse(userData) });
        } else {
          setError('Invalid email or password');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.log('Login Error:', error);
      setError('An error occurred during login');
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Your App Name</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Password..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signupBtn} onPress={navigateToSignUp}>
        <Text style={styles.loginText}>SIGN UP</Text>
      </TouchableOpacity>
    </View>
  );
}

function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [UserType, setUserType] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!email || !username || !password || !confirmPassword || !country) {
      setError('Please fill in all fields');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      try {
        const userData = await AsyncStorage.getItem(email);
        if (userData) {
          setError('Email already exists');
        } else {
          const newUser = {
            email,
            username,
            password,
            UserType,
          };
          await AsyncStorage.setItem(email, JSON.stringify(newUser));
          console.log('Sign Up Successful');
          setError('');
          navigation.navigate('Dashboard', { email });
        }
      } catch (error) {
        console.log('Sign Up Error:', error);
        setError('An error occurred during sign up');
      }
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Your App Name</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Password..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Confirm Password..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setConfirmPassword(text)}
        />
      </View>
     <View style={styles.inputView}>
        <Picker
          selectedValue={UserType}
          onValueChange={(itemValue) => setUserType(itemValue)}
          style={styles.inputText}
        >
         <Picker.Item label="Admin" value="Admin" />
          <Picker.Item label="User" value="User" />
          
         
          {/* Add more countries as needed */}
        </Picker>
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleSignUp}>
        <Text style={styles.loginText}>SIGN UP</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signupBtn} onPress={navigateToLogin}>
        <Text style={styles.loginText}>GO BACK TO LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

function DashboardScreen({ route }) {
  const { userData } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.dashboardText}>Welcome, {userData.username}</Text>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#000',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#003f5c',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: '#003f5c',
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#003f5c',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  signupBtn: {
    width: '80%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#003f5c',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  dashboardText: {
    fontSize: 24,
    textAlign: 'center',
  },
});
