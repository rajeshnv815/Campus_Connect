import React, { useEffect, useState } from 'react'
import { db } from '../firebase/index';
import { View, Text, TouchableOpacity } from 'react-native';
import { getFirestore, collection, doc, onSnapshot } from 'firebase/firestore';

export const User = ({ id, navigation }) => {
    console.log('You came to user screen');
    const [name,setName] = useState('');

    useEffect(() => {
        console.log(`Fetching user profile for ID: ${id}`);
        
        const userDocRef = doc(db, 'users', id, 'profile', 'userInfo');

        const unsubscribe = onSnapshot(userDocRef, doc => {
            if (doc.exists()) {
                console.log(`Received user profile data for ID: ${id}`, doc.data());
                setName(doc.data().name);
            } else {
                console.log(`No user profile data found for ID: ${id}`);
            }
        });

        // clean up function
        return () => unsubscribe();
    }, [id]);
    
    const handleChatPress = () => {
        console.log(`Navigating to Chat screen with ID: ${id} and Name: ${name}`);
        navigation.navigate('Chat', { userId: id, userName: name });
    };

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
            <Text>{name}</Text>
            <TouchableOpacity onPress={handleChatPress}>
                <Text>Chat</Text>
            </TouchableOpacity>
        </View>
    )
}
