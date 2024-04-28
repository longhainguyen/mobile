import { View, Text } from '../../compoments/Themed';
import { COLORS } from '../../constants';

interface SearchProps {
    route: any;
    navigation: any;
}

const Search = ({ route, navigation }: SearchProps) => {
    return (
        <View style={{ flex: 1, marginTop: 10, backgroundColor: COLORS.lightWhite }}>
            <Text>Search</Text>
        </View>
    );
};

export default Search;
