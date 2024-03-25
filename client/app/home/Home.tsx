import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import UserIcon from '../../compoments/userIcon';
import { FONT } from '../../constants/font';
import User from '../../dataTemp/User';

const { height, width } = Dimensions.get('window');

export default function Home() {
    const [userName, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [isFollowed, setIsFollow] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('userName').then((results) => {
            if (results) {
                setUsername(results);
            }
        });

        AsyncStorage.getItem('userId').then((results) => {
            if (results) {
                setUserId(results);
            }
        });

        AsyncStorage.getItem('email').then((results) => {
            if (results) {
                setEmail(email);
            }
        });
    }, []);

    return (
        <ScrollView style={{ flex: 1, marginTop: 15 }}>
            <View
                style={{
                    marginHorizontal: 10,
                    height: height / 15,
                    borderBottomWidth: 2,
                    justifyContent: 'center',
                    borderColor: COLORS.borderColor,
                }}
            >
                <Text style={{ fontFamily: FONT.medium, fontSize: 20 }}>Social Network</Text>
            </View>
            <UserIcon avatar={User[1].avatar} isFollowed={false} userName={User[1].name} />

            <UserIcon avatar={User[0].avatar} isFollowed={true} userName={User[0].name} />
            <UserIcon avatar={User[2].avatar} isFollowed={true} userName={User[2].name} />
        </ScrollView>
    );
}
