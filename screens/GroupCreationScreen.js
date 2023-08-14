// GroupCreationScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../firebase/index';
import { addDoc, collection } from 'firebase/firestore';

export default function GroupCreationScreen({ navigation }) {
    const [groupName, setGroupName] = useState('');

    const createGroupAndNavigate = async () => {
        if (groupName.trim() === '') {
            Alert.alert('Error', 'Please enter a valid group name.');
            return;
        }

        try {
            const newGroup = {
                name: groupName,
                members: [auth.currentUser.uid],
                createdBy: auth.currentUser.uid
            };

            const groupsCollection = collection(db, 'groups');
            const groupDocRef = await addDoc(groupsCollection, newGroup);

            // Navigating to InviteUsersScreen with the group name and its ID
            navigation.navigate('InviteUsers', { groupName: groupName, groupId: groupDocRef.id });
        } catch (error) {
            Alert.alert('Error', 'There was an error creating the group.');
            console.error("Error creating group: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={groupName}
                onChangeText={setGroupName}
                placeholder="Group Name"
            />

            <Button title="Next" onPress={createGroupAndNavigate} />
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
});
