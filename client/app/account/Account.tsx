import { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Account({ navigation }: any) {
    const logout = () => {
        AsyncStorage.setItem('isLoggedIn', '');
        navigation.navigate('Login');
    };

    useEffect(() => {
        AsyncStorage.getItem('userName').then((results) => {
            console.log(results);
        });
    }, []);

    return (
        <View>
            <Text>Account</Text>
            <TouchableOpacity
                style={{ padding: 20, backgroundColor: COLORS.redButton }}
                onPress={logout}
            >
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
