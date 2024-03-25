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

type Props = NativeStackScreenProps<RootStackParamList, 'FogetPass', 'MyStack'>;

const { height, width } = Dimensions.get('window');

export default function ForgetPass({ route, navigation }: Props) {
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
                            Tiếp
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
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
