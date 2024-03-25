import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

export default function Home() {
    const [userName, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('userName').then((results) => {
            console.log(results);
        });
    }, []);

    return (
        <View>
            <Text>Home</Text>
        </View>
    );
}
