import {
    Alert,
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { IMAGE } from '../../constants/image';
import { COLORS } from '../../constants/colors';
import { FONT, FONT_SIZE } from '../../constants/font';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useState } from 'react';
import axios from 'axios';
import request from '../../config/request';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { registerApi } from '../../api/auth.api';
import createTwoButtonAlert from '../../compoments/AlertComponent';

const { height, width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Register', 'MyStack'>;

export default function Register({ route, navigation }: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showRePass, setShowRePass] = useState(false);

    const handleRegister = async () => {
        if (rePassword !== password || rePassword === '' || password === '') {
            createTwoButtonAlert({
                content: 'Mật khẩu điền lại không chính xác',
                title: 'Đăng ký',
            });
            return;
        }
        const response = await registerApi({
            email: email,
            password: password,
            username: username,
        });

        if (response.status === 201) {
            navigation.navigate('Login');
        } else {
            createTwoButtonAlert({
                title: 'Đăng ký',
                content: response.message || 'Kết nối server thất bại',
            });
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: height / 4,
                        }}
                    >
                        <Image
                            style={{
                                borderRadius: 10,
                                width: 60,
                                height: 60,
                            }}
                            source={IMAGE.logo}
                        ></Image>
                    </View>

                    <View style={styles.input_box}>
                        <TextInput
                            placeholder="Tên"
                            placeholderTextColor={COLORS.darkText}
                            onChangeText={setUsername}
                            style={{
                                fontFamily: FONT.regular,
                                paddingLeft: 10,
                                fontSize: FONT_SIZE.small,
                            }}
                        ></TextInput>
                    </View>

                    <View style={[styles.input_box, { marginTop: 20 }]}>
                        <TextInput
                            placeholder="Số điện thoại hoặc email"
                            placeholderTextColor={COLORS.darkText}
                            onChangeText={(text) => setEmail(text.trim())}
                            style={{
                                fontFamily: FONT.regular,
                                paddingLeft: 10,
                                fontSize: FONT_SIZE.small,
                            }}
                        ></TextInput>
                    </View>

                    <View>
                        <View
                            style={[
                                styles.input_box,
                                {
                                    marginTop: 20,
                                    paddingRight: 20,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                },
                            ]}
                        >
                            <TextInput
                                secureTextEntry={showPass ? false : true}
                                placeholder="Mật khẩu"
                                onChangeText={setPassword}
                                placeholderTextColor={COLORS.darkText}
                                style={{
                                    flex: 1,
                                    fontFamily: FONT.regular,
                                    paddingLeft: 10,
                                    fontSize: FONT_SIZE.small,
                                }}
                            ></TextInput>
                            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                                {showPass ? (
                                    <AntDesign name="eyeo" size={20} color="black" />
                                ) : (
                                    <Feather name="eye-off" size={20} color="black" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <View
                            style={[
                                styles.input_box,
                                {
                                    marginTop: 20,
                                    paddingRight: 20,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                },
                            ]}
                        >
                            <TextInput
                                secureTextEntry={showRePass ? false : true}
                                placeholder="Gõ lại mật khẩu"
                                placeholderTextColor={COLORS.darkText}
                                onChangeText={setRePassword}
                                style={{
                                    flex: 1,
                                    fontFamily: FONT.regular,
                                    paddingLeft: 10,
                                    fontSize: FONT_SIZE.small,
                                }}
                            ></TextInput>

                            <TouchableOpacity onPress={() => setShowRePass(!showRePass)}>
                                {showRePass ? (
                                    <AntDesign name="eyeo" size={20} color="black" />
                                ) : (
                                    <Feather name="eye-off" size={20} color="black" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={{
                            padding: 18,
                            backgroundColor: COLORS.redButton,
                            marginVertical: 20,
                            borderRadius: 50,
                            marginHorizontal: 100,
                        }}
                        onPress={handleRegister}
                    >
                        <Text
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontFamily: FONT.bold,
                                color: COLORS.lightWhite,
                                textAlign: 'center',
                                fontSize: FONT_SIZE.small,
                            }}
                        >
                            Đăng ký
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Login');
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: FONT.medium,
                                fontSize: FONT_SIZE.small,
                                color: COLORS.darkText,
                                textAlign: 'center',
                            }}
                        >
                            Bạn đã có tài khoản
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
    },

    input_box: {
        paddingVertical: 18,
        marginHorizontal: 18,
        backgroundColor: COLORS.lightWhite,
        borderRadius: 30,
    },
});
