import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/index';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, doc, orderBy, query, addDoc, onSnapshot, Timestamp, limit } from 'firebase/firestore';

const GroupChatScreen = ({ route }) => {
    const { groupId, groupName } = route.params;

    const [user, setUser] = useState(auth.currentUser);
    const [messageList, setMessageList] = useState([]);
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(false);

    const messagesRef = collection(db, 'groupChats', groupId, 'messages');

    useEffect(() => {
        setLoading(true);
        if (user) {
            const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(25));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setMessageList(data.reverse());
            });
            return () => unsubscribe();
        }
        setLoading(false);
    }, [user]);

    const [newMessage, setNewMessage] = useState('');

    const sendMessage = async () => {
        if (newMessage.length) setSending(true);
        const message = {
            text: newMessage,
            createdAt: Timestamp.now(),
            senderId: user.uid,
            senderName: user.displayName
        };
        await addDoc(messagesRef, message);
        setNewMessage('');
        setSending(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.groupName}>{groupName}</Text>
            {loading && <ActivityIndicator />}
            <FlatList
                data={messageList}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={item.senderId === user.uid ? styles.sentContainer : styles.receivedContainer}>
                        <Text style={styles.senderName}>{item.senderName}</Text>
                        <Text>{item.text}</Text>
                    </View>
                )}
            />

            <TextInput
                style={styles.input}
                onChangeText={text => setNewMessage(text)}
                value={newMessage}
            />
            <Button title="Send Message" onPress={sendMessage} />
            {sending && <ActivityIndicator />}
        </View>
    );
}

// ... The rest of your styles ...
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 15
    },
    sentContainer: {
        alignSelf: 'flex-end',
        backgroundColor: '#e6e6fa',
        padding: 10,
        borderRadius: 10,
        marginBottom: 5
    },
    receivedContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#dcdcdc',
        padding: 10,
        borderRadius: 10,
        marginBottom: 5
    },
    senderName: {
        fontWeight: 'bold',
        marginBottom: 5
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10
    },
    sentContainer: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6', // Light green color similar to WhatsApp
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
        maxWidth: '80%',  // This ensures the message doesn't take the full width
    },
    receivedContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#dcdcdc',
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
        maxWidth: '80%',
    },
});
export default GroupChatScreen;
