import {
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
import { LINK } from '../../config/localhot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserData from '../../dataTemp/UserData';
import request from '../../config/request';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import createTwoButtonAlert from '../../compoments/AlertComponent';
import { IUser } from '../../type/User.type';
import { store } from '../../redux/Store';
import { setStateUser } from '../../redux/stateUser/stateUser';
import { loginApi } from '../../api/auth.api';

type Props = NativeStackScreenProps<RootStackParamList, 'Login', 'MyStack'>;

const { height, width } = Dimensions.get('window');

export default function Login({ route, navigation }: Props) {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleLogin = async () => {
        const response = await loginApi({
            email: email,
            password: password,
        });

        if (response.status === 200) {
            const user: IUser = {
                id: response.id + '',
                email: response.email,
                username: response.username,
                isLoggedIn: true,
                profile: {
                    avatar: response.profile.avatar,
                    background: UserData[0].background,
                },
            };
            console.log(user, 'at clientappauthenLogin.tsx');
            store.dispatch(setStateUser(user));

            await AsyncStorage.removeItem('User');
            await AsyncStorage.setItem('User', JSON.stringify(user));
            navigation.navigate('BottomTab');
        } else {
            createTwoButtonAlert({
                title: 'Đăng nhập',
                content: response.message || 'Kết nối server thất bại',
            });
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView style={styles.container}>
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
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.input_box}>
                        <TextInput
                            placeholder="Số điện thoại hoặc email"
                            placeholderTextColor={COLORS.darkText}
                            style={{
                                fontFamily: FONT.regular,
                                paddingLeft: 10,
                                fontSize: FONT_SIZE.small,
                            }}
                            onChangeText={(text) => setEmail(text.trim())}
                        ></TextInput>
                    </View>

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
                            placeholderTextColor={COLORS.darkText}
                            style={{
                                fontFamily: FONT.regular,
                                paddingLeft: 10,
                                fontSize: FONT_SIZE.small,
                                flex: 1,
                            }}
                            onChangeText={setPassword}
                        ></TextInput>
                        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                            {showPass ? (
                                <AntDesign name="eyeo" size={20} color="black" />
                            ) : (
                                <Feather name="eye-off" size={20} color="black" />
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={{
                            padding: 18,
                            backgroundColor: COLORS.redButton,
                            marginVertical: 20,
                            borderRadius: 50,
                            marginHorizontal: 100,
                        }}
                        onPress={handleLogin}
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
                            Đăng nhập
                        </Text>
                    </TouchableOpacity>
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('FogetPass');
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
                                Bạn quên mật khẩu ?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

                <TouchableOpacity
                    style={{
                        marginTop: 200,
                        paddingVertical: 18,
                        marginHorizontal: 18,
                        backgroundColor: COLORS.lightWhite,
                        borderRadius: 30,
                        borderColor: COLORS.redButton,
                        borderWidth: 1,
                    }}
                    onPress={() => {
                        navigation.navigate('Register');
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            color: COLORS.redButton,
                            fontFamily: FONT.medium,
                            fontSize: FONT_SIZE.small,
                        }}
                    >
                        Tạo tạo khoản mới
                    </Text>
                </TouchableOpacity>
            </ScrollView>
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
