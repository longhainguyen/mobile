import { View, Text, ScrollView, Dimensions } from 'react-native';
import { COLORS } from '../../constants';
import InfoAccount from '../../compoments/InfoAccount';
import UserData from '../../dataTemp/UserData';
import ButtonBack from '../../compoments/ButtonBack';

type AccountOtherProps = {
    route: any;
    navigation: any;
};

const { height, width } = Dimensions.get('window');

const AccountOther = ({ route, navigation }: AccountOtherProps) => {
    // console.log(route.params);

    const { avatar, isFollowed, isOwner, userName } = route.params;

    return (
        <ScrollView style={{ flex: 1, marginTop: 10, backgroundColor: COLORS.white }}>
            <ButtonBack title={userName} onBack={() => navigation.goBack()} />
            <View style={{ height: height / 13 }}></View>
            <InfoAccount
                isOwn={false}
                avatar={avatar}
                cover={UserData[1].background}
                name={userName}
            />
        </ScrollView>
    );
};

export default AccountOther;
