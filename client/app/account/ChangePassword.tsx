import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import React, { useState } from 'react';
import ButtonBack from '../../compoments/ButtonBack';
import { FONT, FONT_SIZE } from '../../constants/font';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { updatePassword } from '../../api/user.api';
import { RootStackParamList } from '../../navigation';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type UpdatePasswordProps = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

export default function ChangePassword({ route, navigation }: UpdatePasswordProps) {
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [showOldPass, setShowOldpass] = useState(false);
    const [showNewPass, setShowNewpass] = useState(false);

    const handleChangePassword = async () => {
        if (!oldPass || !newPass) {
            Alert.alert('Error', 'Both fields are required.');
            return;
        }

        try {
            const userId = route.params?.user.id + '';
            const response = await updatePassword(oldPass, newPass, userId);

            Alert.alert('Success', 'Password changed successfully.');

            setOldPass('');
            setNewPass('');
        } catch (error) {
            console.error('Error changing password:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1 }}>
                <ButtonBack title="Update Password" onBack={() => navigation.goBack()} />
                <View style={{ height: 100 }}></View>
                <View style={{ gap: 10, justifyContent: 'center', marginHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            secureTextEntry={showOldPass ? false : true}
                            style={styles.input}
                            value={oldPass}
                            onChangeText={setOldPass}
                            placeholder="Nhập mật khẩu cũ"
                        />
                        <TouchableOpacity onPress={() => setShowOldpass(!showOldPass)}>
                            {showOldPass ? (
                                <AntDesign name="eyeo" size={20} color="black" />
                            ) : (
                                <Feather name="eye-off" size={20} color="black" />
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            secureTextEntry={showNewPass ? false : true}
                            style={styles.input}
                            value={newPass}
                            onChangeText={setNewPass}
                            placeholder="Nhập mật khẩu mới"
                        />
                        <TouchableOpacity onPress={() => setShowNewpass(!showNewPass)}>
                            {showNewPass ? (
                                <AntDesign name="eyeo" size={20} color="black" />
                            ) : (
                                <Feather name="eye-off" size={20} color="black" />
                            )}
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={styles.button}
                            onPress={async () => {
                                await handleChangePassword();
                            }}
                        >
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
        flex: 1,
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
