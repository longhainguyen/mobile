import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
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
                <View style={{ gap: 4, justifyContent: 'center' }}>
                    <TextInput style={styles.input} value={userName} onChangeText={setUserName} />
                    <Text style={styles.input}>{user?.email}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Button title="Save" onPress={handleSaveInfo} />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        fontFamily: FONT.regular,
        fontSize: FONT_SIZE.small,
    },
});
