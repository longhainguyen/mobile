import { TouchableOpacity, View, Text } from 'react-native';
import { COLORS } from '../constants/colors';
import { AntDesign } from '@expo/vector-icons';
import { FONT, FONT_SIZE } from '../constants/font';

type ButtonBackProp = {
    title: string;
    onBack: () => void;
};

const ButtonBack = ({ title, onBack }: ButtonBackProp) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                borderColor: COLORS.borderColor,
                borderBottomWidth: 2,
                paddingBottom: 8,
                justifyContent: 'flex-start',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 999,
                backgroundColor: COLORS.lightWhite,
            }}
        >
            <TouchableOpacity onPress={onBack}>
                <AntDesign name="back" size={24} color="black" style={{ padding: 15 }} />
            </TouchableOpacity>

            <Text
                style={{
                    fontSize: FONT_SIZE.large,
                    fontFamily: FONT.bold,
                    textAlign: 'center',
                    marginTop: 5,
                }}
            >
                {title}
            </Text>
        </View>
    );
};

export default ButtonBack;
