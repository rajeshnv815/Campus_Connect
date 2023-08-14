// InviteUsersScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { db, auth } from '../firebase/index';
import { get, getDoc, doc, getDocs, collection, addDoc,arrayUnion  } from 'firebase/firestore';

export default function InviteUsersScreen({ navigation, route }) {
    const { groupName, groupId } = route.params;
    const [usersList, setUsersList] = useState([]);
    const [currentUserInterests, setCurrentUserInterests] = useState([]);
    const user = auth.currentUser;

    useEffect(() => {
        const fetchCurrentUserInterests = async () => {
            const userDocRef = doc(db, 'users', user.uid, 'profile', 'interests');
            const userDoc = await getDoc(userDocRef);
            const interests = userDoc.data()?.interests || [];
            setCurrentUserInterests(interests);
        };

        fetchCurrentUserInterests();
    }, [user]);

    useEffect(() => {
        const fetchMatchingUsers = async () => {
            if (currentUserInterests.length > 0) {
                const allUsersRef = collection(db, 'users');
                const snapshot = await getDocs(allUsersRef);
    
                if (!snapshot.empty) {
                    let usersData = [];

                    for (const fdoc of snapshot.docs) {
                        const user = fdoc.data();

                        if (user.userid !== auth.currentUser.uid) {
                            const userInfoRef = doc(db, 'users', user.userid, 'profile', 'interests');
                            const userDoc = await getDoc(userInfoRef);
                            const userInterests = userDoc.data()?.interests || [];

                            const usernameInfoRef = doc(db, 'users', user.userid, 'profile', 'userInfo');
                            const usernameDoc = await getDoc(usernameInfoRef);
                            const username = usernameDoc.data()?.name;

                            const hasMatchingInterests = userInterests.some(interest => currentUserInterests.includes(interest));
                            if (hasMatchingInterests) {
                                usersData.push({ ...user, id: fdoc.id, name: username });
                            }
                        }
                    }

                    setUsersList(usersData);
                }
            }
        }

        fetchMatchingUsers();
    }, [currentUserInterests]);

    const inviteUserToGroup = async (userId) => {
        // Reference to the 'invitations' sub-collection for the user
        const invitationsRef = collection(db, 'users', userId, 'invitations');

        await addDoc(invitationsRef, {
            groupId: groupId,
            status: 'pending'
        });

        Alert.alert('Success', `User ${userId} invited to group ${groupName}`);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={usersList}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text>{item.name}</Text>
                        <Button title="Invite" onPress={() => inviteUserToGroup(item.id)} />
                    </View>
                )}
                keyExtractor={item => item.id}
            />

            <Button title="Done" onPress={() => navigation.navigate('Groups')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
});
