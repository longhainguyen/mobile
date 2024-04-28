import { View, Text } from '../../compoments/Themed';
import { COLORS } from '../../constants';

interface InformProps {
    route: any;
    navigation: any;
}

const Inform = ({ route, navigation }: InformProps) => {
    return (
        <View style={{ flex: 1, marginTop: 10, backgroundColor: COLORS.lightWhite }}>
            <Text>Inform</Text>
        </View>
    );
};

export default Inform;
