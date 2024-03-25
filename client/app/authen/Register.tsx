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

const { height, width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Register', 'MyStack'>;

export default function Register({ route, navigation }: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://192.168.1.139:5000/register', {
                username,
                password,
                email,
            });
            console.log(response.data);
            // Handle success response from API
        } catch (error) {
            console.error('Error registering user:', error);
            // Handle error response from API
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
                            onChangeText={setEmail}
                            style={{
                                fontFamily: FONT.regular,
                                paddingLeft: 10,
                                fontSize: FONT_SIZE.small,
                            }}
                        ></TextInput>
                    </View>

                    <View>
                        <View style={[styles.input_box, { marginTop: 20 }]}>
                            <TextInput
                                placeholder="Mật khẩu"
                                onChangeText={setPassword}
                                placeholderTextColor={COLORS.darkText}
                                style={{
                                    fontFamily: FONT.regular,
                                    paddingLeft: 10,
                                    fontSize: FONT_SIZE.small,
                                }}
                            ></TextInput>
                        </View>
                    </View>

                    <View>
                        <View style={[styles.input_box, { marginTop: 20 }]}>
                            <TextInput
                                placeholder="Gõ lại mật khẩu"
                                placeholderTextColor={COLORS.darkText}
                                style={{
                                    fontFamily: FONT.regular,
                                    paddingLeft: 10,
                                    fontSize: FONT_SIZE.small,
                                }}
                            ></TextInput>
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
