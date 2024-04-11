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

type Props = NativeStackScreenProps<RootStackParamList, 'Login', 'MyStack'>;

const { height, width } = Dimensions.get('window');

export default function Login({ route, navigation }: Props) {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleLogin = async () => {
        try {
            // Example call api
            // const response = await axios.post(`http://${LINK.localhot}:${LINK.port}/login`, {
            //     password,
            //     email,
            // });
            // AsyncStorage.setItem('userId', JSON.stringify(response.data.data[0].id));
            // AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
            // AsyncStorage.setItem('userName', response.data.data[0].username);
            // AsyncStorage.setItem('email', response.data.data[0].email);
            // navigation.navigate('BottomTab');
            // Handle success response from API
            await AsyncStorage.setItem('userId', JSON.stringify(UserData[0].id));
            await AsyncStorage.setItem('userName', UserData[0].name);
            await AsyncStorage.setItem('email', UserData[0].email);
            AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
            navigation.navigate('BottomTab');
        } catch (error) {
            console.error('Error registering user:', error);
            // Handle error response from API
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
                            onChangeText={setEmail}
                        ></TextInput>
                    </View>

                    <View style={[styles.input_box, { marginTop: 20 }]}>
                        <TextInput
                            placeholder="Mật khẩu"
                            placeholderTextColor={COLORS.darkText}
                            style={{
                                fontFamily: FONT.regular,
                                paddingLeft: 10,
                                fontSize: FONT_SIZE.small,
                            }}
                            onChangeText={setPassword}
                        ></TextInput>
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
