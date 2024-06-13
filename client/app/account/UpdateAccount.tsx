import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ButtonBack from '../../compoments/ButtonBack';
import { IUser } from '../../type/User.type';
import { RouteProp } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { FONT, FONT_SIZE } from '../../constants/font';
import { updateUser } from '../../api/user.api';
import createTwoButtonAlert from '../../compoments/AlertComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../../redux/Store';
import { setStateUser } from '../../redux/stateUser/stateUser';

// type RootStackParamList = {
//     UpdatePost: {
//         user: IUser;
//     };
// };

type EditUserRouteProp = NativeStackScreenProps<RootStackParamList, 'UpdateAccount'>;

type UpdateAccountProps = NativeStackScreenProps<RootStackParamList, 'UpdateAccount'>;

// type UpdateAccountProps = {
//     route: EditUserRouteProp;
//     navigation: any;
// };

export default function UpdateAccount({ navigation, route }: UpdateAccountProps) {
    const [user, setUser] = useState<IUser>();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (route.params) {
            setUser(route.params.user);
            setUserName(route.params.user.username);
        } else {
            console.log('no route.params in update user');
        }
    }, []);

    const handleSaveInfo = () => {
        Alert.alert(
            'Confirm Save',
            'Are you sure you want to save this info?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Save cancelled'),
                    style: 'cancel',
                },
                {
                    text: 'Save',
                    onPress: async () => {
                        try {
                            if (user?.id) {
                                const response = await updateUser(
                                    {
                                        username: userName,
                                    },
                                    user?.id,
                                );

                                const userString = await AsyncStorage.getItem('User');
                                if (userString) {
                                    const user = JSON.parse(userString);
                                    user.username = userName;
                                    store.dispatch(setStateUser(user));
                                    await AsyncStorage.setItem('User', JSON.stringify(user));
                                }
                                createTwoButtonAlert({ content: 'Save', title: 'Success' });
                            }
                        } catch (error) {
                            createTwoButtonAlert({ content: 'Error', title: 'Save error' });
                        } finally {
                            Keyboard.dismiss();
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true },
        );
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1 }}>
                <ButtonBack title="Update Account" onBack={() => navigation.goBack()} />
                <View style={{ height: 100 }}></View>
                <View style={{ gap: 10, justifyContent: 'center' }}>
                    <TextInput style={styles.input} value={userName} onChangeText={setUserName} />
                    <Text style={styles.input}>{user?.email}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {/* <Button title="Save" onPress={handleSaveInfo} /> */}
                        <TouchableOpacity style={styles.button} onPress={handleSaveInfo}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginHorizontal: 15,
        fontFamily: FONT.regular,
        fontSize: FONT_SIZE.small,
        borderRadius: 8, // tạo bo tròn các góc
        backgroundColor: '#f9f9f9', // nền trắng nhạt
    },

    button: {
        height: 50,
        paddingHorizontal: 20,
        backgroundColor: '#6200EE',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25, // Bo tròn góc nút
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5, // Tạo độ bóng trên Android
    },
    buttonText: {
        color: '#fff',
        fontFamily: FONT.bold,
        fontSize: FONT_SIZE.medium,
    },
});
