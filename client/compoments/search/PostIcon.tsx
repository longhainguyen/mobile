import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FONT, FONT_SIZE } from '../../constants/font';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { IMAGE } from '../../constants';

export default function PostIcon({
    caption,
    avatar,
    id,
    navigation,
    idUserOwn,
}: {
    caption: string;
    avatar: string;
    id: string;
    navigation: any;
    idUserOwn: string;
}) {
    const stateUser = useSelector((state: RootState) => state.reducerUser);
    return (
        <View
            style={{
                flexDirection: 'row',
                gap: 7,
                marginLeft: 10,
                alignItems: 'center',
                paddingHorizontal: 5,
                paddingVertical: 10,
            }}
            // onPress={() => {
            //     // navigation.navigate('ShowPost', {
            //     //     isOwner: idUserOwn === stateUser.id ? true : false,
            //     //     postId: id,
            //     // });
            // }}
        >
            <Image
                style={{ width: 40, height: 40, resizeMode: 'stretch' }}
                source={IMAGE.postIcon}
            />
            <Text style={{ fontFamily: FONT.bold, fontSize: FONT_SIZE.small }}>
                {caption.length > 50 ? caption.substring(0, 50) : caption}
            </Text>
        </View>
    );
}
