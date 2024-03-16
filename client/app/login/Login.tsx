import { Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { IMAGE } from "../../constants/image";
import { COLORS } from "../../constants/colors";
import { FONT, FONT_SIZE } from "../../constants/font";

const { height, width } = Dimensions.get("window");

export default function Login() {

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}

            accessible={false}>

            <View style={styles.container}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: height / 4
                }}>
                    <Image style={{
                        borderRadius: 10,
                        width: 60,
                        height: 60,
                    }}

                        source={IMAGE.logo}>

                    </Image>
                </View>



                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.input_box}>
                    <TextInput
                        placeholder="Số điện thoại hoặc email"
                        placeholderTextColor={COLORS.darkText}
                        style={{
                            fontFamily: FONT.regular,
                            paddingLeft: 10,
                            fontSize: FONT_SIZE.small
                        }}
                    >

                    </TextInput>
                </KeyboardAvoidingView>


                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={[styles.input_box, { marginTop: 20 }]}>
                    <TextInput
                        placeholder="Mật khẩu"
                        placeholderTextColor={COLORS.darkText}
                        style={{
                            fontFamily: FONT.regular,
                            paddingLeft: 10,
                            fontSize: FONT_SIZE.small,
                        }}
                    >

                    </TextInput>
                </KeyboardAvoidingView>

                <TouchableOpacity
                    style={{
                        padding: 18,
                        backgroundColor: COLORS.redButton,
                        marginVertical: 20,
                        borderRadius: 50,
                        marginHorizontal: 100,
                    }}
                >
                    <Text style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontFamily: FONT.bold,
                        color: COLORS.lightWhite,
                        textAlign: 'center',
                        fontSize: FONT_SIZE.small,
                    }}>
                        Đăng nhập
                    </Text>
                </TouchableOpacity>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                    <TouchableOpacity>
                        <Text
                            style={{
                                fontFamily: FONT.medium,
                                fontSize: FONT_SIZE.small,
                                color: COLORS.darkText,
                                textAlign: "center",
                            }}
                        >Bạn quên mật khẩu ?</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <TouchableOpacity style={{
                        position: 'absolute', bottom: 40, left: 0, right: 0,
                        paddingVertical: 18,
                        marginHorizontal: 18,
                        backgroundColor: COLORS.lightWhite,
                        borderRadius: 30,
                        borderColor: COLORS.redButton,
                        borderWidth: 1,
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            color: COLORS.redButton,
                            fontFamily: FONT.medium,
                            fontSize: FONT_SIZE.small,
                        }}>
                            Tạo tạo khoản mới
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>

    )

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
    }
});