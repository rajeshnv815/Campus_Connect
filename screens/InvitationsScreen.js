import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../firebase/index';
import {getDoc, getDocs, collection, doc, updateDoc, deleteDoc,arrayUnion } from 'firebase/firestore';

export default function InvitationsScreen({ navigation }) {
    const [invitations, setInvitations] = useState([]);
    const [acceptedInvites, setAcceptedInvites] = useState([]);
    const [declinedInvites, setDeclinedInvites] = useState([]);

    useEffect(() => {
        const fetchInvitations = async () => {
            const user = auth.currentUser;
            const invitationsRef = collection(db, 'users', user.uid, 'invitations');
            const snapshot = await getDocs(invitationsRef);
            let fetchedInvitations = [];
            
            for (let inviteDoc of snapshot.docs) {
                const groupId = inviteDoc.data().groupId;
                const groupRef = doc(db, 'groups', groupId);
                console.log('Invitation for groupId:', groupId);
                const groupDoc = await getDoc(groupRef);
                if (groupDoc.exists()) {
                    fetchedInvitations.push({
                        id: inviteDoc.id,
                        groupName: groupDoc.data().name,
                        ...inviteDoc.data()
                    });
                } else {
                    console.error("Group not found:", groupId);
                }
            }
        
            setInvitations(fetchedInvitations);
        };
        

        fetchInvitations();
    }, []);

    const acceptInvitation = async (inviteId, groupId) => {
        // Add the user to the group's members
        const groupRef = doc(db, 'groups', groupId);
        
        await updateDoc(groupRef, {
            members: arrayUnion(auth.currentUser.uid)  // Use the imported arrayUnion
        });
    
        // Delete or update the invitation status in the user's invitations
        const inviteRef = doc(db, 'users', auth.currentUser.uid, 'invitations', inviteId);
        await deleteDoc(inviteRef); // Or update the status to 'accepted'
    
        Alert.alert('Joined', 'You have joined the group!');
        setAcceptedInvites(prevState => [...prevState, inviteId]);
    };
    
    const declineInvitation = async (inviteId) => {
        // Delete or update the invitation status
        const inviteRef = doc(db, 'users', auth.currentUser.uid, 'invitations', inviteId);
        await deleteDoc(inviteRef); // Or update the status to 'declined'
    
        Alert.alert('Declined', 'You declined the invitation.');
        setDeclinedInvites(prevState => [...prevState, inviteId]);
    };
    

    return (
        <View style={styles.container}>
            <FlatList
                data={invitations}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text>{item.groupName}</Text>
                        <View style={styles.buttons}>
                            <Button 
                                title="Accept" 
                                onPress={() => acceptInvitation(item.id, item.groupId)} 
                                disabled={acceptedInvites.includes(item.id) || declinedInvites.includes(item.id)}
                            />
                            <Button 
                                title="Decline" 
                                onPress={() => declineInvitation(item.id)} 
                                disabled={acceptedInvites.includes(item.id) || declinedInvites.includes(item.id)}
                            />
                        </View>
                    </View>
                )}
                keyExtractor={item => item.id}
            />
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
        alignItems: 'center',
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 150,
    },
});