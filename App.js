import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './routes/AuthStack';
import MainStack from './routes/MainStack';
import AuthContext from './firebase/AuthContext';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ProfileScreen from './screens/ProfileScreen'
import {createStackNavigator} from '@react-navigation/stack';
const RootStack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // Retrieve the login state from async storage when the app starts
  React.useEffect(() => {
    const retrieveLoginState = async () => {
   //   const userToken = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(false);
    };

    retrieveLoginState();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <RootStack.Screen name="MainApp" component={MainStack} />
          ) : (
            <>
              <RootStack.Screen name="Login" component={LoginScreen} />
              <RootStack.Screen name="Signup" component={SignupScreen} />
              <RootStack.Screen name="Profile" component={ProfileScreen} />
            </>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
export default App;
