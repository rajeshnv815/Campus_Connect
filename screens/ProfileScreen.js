import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

import { INTERESTS } from '../screens/Interests';
import { GOALS } from '../screens/Goals';
import firebase from 'firebase/app';
import { auth,db, firestore,createUserWithEmailAndPassword } from '../firebase/index';
import { setDoc, doc ,addDoc, collection} from 'firebase/firestore';
const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(auth.currentUser);
    console.log('loggedin user'+user);
    const [interests, setInterests] = useState([]);
    const [goals, setGoals] = useState([]);
  
    // Submit the interests and goals to the Firebase
    const submitInfo = async () => {
      try {
        const profileCollectionRef = collection(db, 'users', user?.uid, 'profile');
  
        // add new 'interests' and 'goals' docs to the profile collection
        await setDoc(doc(profileCollectionRef, 'interests'), { interests });
        await setDoc(doc(profileCollectionRef, 'goals'), { goals });
  
        // Update the user object with the new interests and goals
        const updatedUser = { ...user, interests, goals };
        setUser(updatedUser);
  
        // Navigate to the next screen
        navigation.navigate('Login'); // Change 'NextScreen' with the name of the screen you want to navigate to
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    }
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WHAT ARE YOU INTERESTED IN?</Text>

      <View style={styles.choicesContainer}>
        {INTERESTS.map((interest) => (
          <TouchableOpacity 
            key={interest.id}
            style={interests.includes(interest.id) ? styles.choiceSelected : styles.choice}
            onPress={() => {
              if (interests.includes(interest.id)) {
                setInterests(interests.filter(id => id !== interest.id));
              } else {
                setInterests([...interests, interest.id]);
              }
            }}
          >
            <Text style={styles.choiceText}>{interest.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.title}>CHOOSE YOUR GOALS</Text>

      <View style={styles.choicesContainer}>
        {GOALS.map((goal) => (
          <TouchableOpacity 
            key={goal.id}
            style={goals.includes(goal.id) ? styles.choiceSelected : styles.choice}
            onPress={() => {
              if (goals.includes(goal.id)) {
                setGoals(goals.filter(id => id !== goal.id));
              } else {
                setGoals([...goals, goal.id]);
              }
            }}
          >
            <Text style={styles.choiceText}>{goal.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Submit" onPress={submitInfo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  choicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  choice: {
    width: '48%',
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
  },
  choiceSelected: {
    width: '48%',
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 10,
    marginBottom: 10,
  },
  choiceText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;