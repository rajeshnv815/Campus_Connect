import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase/index';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
export default function GroupsScreen({ navigation }) {
    const [groupsList, setGroupsList] = useState([]);

    useEffect(() => {
        const fetchGroups = () => {
            const groupQuery = query(
                collection(db, 'groups'),
                where('members', 'array-contains', auth.currentUser.uid)
            );

            // Set up real-time listener
            const unsubscribe = onSnapshot(groupQuery, (snapshot) => {
                const fetchedGroups = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setGroupsList(fetchedGroups);
            });

            // Clean up the listener on component unmount
            return () => unsubscribe();
        };

        fetchGroups();
    }, []);

    return (
        <View style={styles.container}>
            {groupsList.length > 0 ? (
                <FlatList
                    data={groupsList}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Text>{item.name}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('GroupChat', { groupId: item.id, groupName: item.name })}>
                                <Text style={styles.chatButton}>Chat in {item.name}</Text>
                            </TouchableOpacity>

                        </View>
                    )}
                    keyExtractor={item => item.id}
                />
            ) : (
                <Text>No groups found</Text>
            )}

            <Button title="Group Creation" onPress={() => navigation.navigate('GroupCreation')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    chatButton: {
        color: 'blue',
        textDecorationLine: 'underline'
    }
});
