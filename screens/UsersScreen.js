import React, { useEffect, useState } from 'react';
import { auth, db, provider } from '../firebase/index';
import { User } from '../screens/User';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';

const Users = ({ navigation }) => {
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true); // Set the initial state to true since we start fetching immediately

    useEffect(() => {
        const usersCollection = collection(db, 'users');
        const unsubscribe = onSnapshot(usersCollection, snapshot => {
            const usersData = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setUsersList(usersData);
            setLoading(false);
        });

        return () => unsubscribe(); // This will unsubscribe from the snapshot when the component is unmounted
    }, []);

    return (
        <View>
            <Text>Connect</Text>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                    data={usersList}
                    keyExtractor={user => user.id}
                    renderItem={({ item }) => <User id={item.id} navigation={navigation} />}
                />
            )}
        </View>
    );
}

export default Users;
