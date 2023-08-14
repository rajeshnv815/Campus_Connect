import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/index';  // Ensure that these are set up using modular style
import { View, Text, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';
import { collection, doc, orderBy, query, addDoc, onSnapshot, Timestamp, limit } from 'firebase/firestore';


const ChatScreen = ({ route }) => {
    console.log('You came to chat screen');
    const { userId, userName } = route.params;

    const [user, setUser] = useState(auth.currentUser);
    const [messageList, setMessageList] = useState([]);
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(false);

    const messagesRef = collection(db, 'users', user?.uid, 'chats', userId, 'messages');
    const messagesRef2 = collection(db, 'users', userId, 'chats', user?.uid, 'messages');

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
        }
        setLoading(false);
    }, [user]);

    const [newMessage, setNewMessage] = useState('');

    const sendMessage = async () => {
        if (newMessage.length) setSending(true);
        const message = {
            text: newMessage,
            createdAt: Timestamp.now(),
            id: user.uid,
            senderName: user.displayName
        };
        if (newMessage.length === 0) return;
        if (user?.uid !== userId) await addDoc(messagesRef2, message);
        await addDoc(messagesRef, message);
        setNewMessage('');
        setSending(false);
    };

    return (
        <View>
            <Text>{userName}</Text>
            {loading && <ActivityIndicator />}
            <FlatList
                data={messageList}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={{ backgroundColor: user.uid === item.id ? '#ddd' : '#eee', marginBottom: 10 }}>
                        <Text>{item.senderName}: {item.text}</Text>
                    </View>
                )}
            />
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => setNewMessage(text)}
                value={newMessage}
            />
            <Button title="Send Message" onPress={sendMessage} />
            {sending && <ActivityIndicator />}
        </View>
    )
}
export default ChatScreen;
