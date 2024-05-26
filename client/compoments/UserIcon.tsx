import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageSourcePropType,
    Modal,
} from 'react-native';
import { COLORS } from '../constants';
import { FONT, FONT_SIZE } from '../constants/font';
import { Entypo } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { followUser, unFollowUser } from '../api/follow.api';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import createTwoButtonAlert from './AlertComponent';

interface UserProp {
    userName: string;
    avatar: any;
    isFollowed: boolean;
    isOwner: boolean;
    width?: number;
    height?: number;
    idUserOfPost?: string;
    threeDotsDisplay?: boolean;
    openOption?: () => void;
    openAccount: () => void;
}

const UserIcon: React.FC<UserProp> = ({
    width = 55,
    height = 55,
    userName,
    avatar,
    isFollowed,
    isOwner,
    threeDotsDisplay = true,
    idUserOfPost,
    openAccount,
    openOption,
}) => {
    const [stateFollow, setStateFollow] = useState(isFollowed);
    const stateUser = useSelector((state: RootState) => state.reducerUser);
    const handleFollow = async () => {
        if (idUserOfPost && stateUser.id) {
            try {
                if (!stateFollow) {
                    const response = await followUser({
                        followingId: parseInt(idUserOfPost),
                        userId: parseInt(stateUser.id),
                    });
                    setStateFollow(true);
                } else {
                    const response = await unFollowUser({
                        followingId: parseInt(idUserOfPost),
                        userId: parseInt(stateUser.id),
                    });
                    setStateFollow(false);
                }
            } catch (error) {
                createTwoButtonAlert({
                    content: 'Error',
                    title: 'Follow',
                });
            }
        }
    };
    return (
        <View
            style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginHorizontal: 10,
                marginTop: 20,
                backgroundColor: COLORS.white,
            }}
        >
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                onPress={openAccount}
            >
                <Image
                    source={avatar}
                    style={{
                        borderRadius: 50,
                        height: height,
                        width: width,
                        borderWidth: 2,
                        borderColor: COLORS.background,
                    }}
                />
                <Text style={{ fontSize: FONT_SIZE.small, fontFamily: FONT.bold, marginLeft: 7 }}>
                    {userName}
                </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
                {!isOwner && (
                    <TouchableOpacity
                        style={{
                            borderColor: COLORS.borderColor,
                            borderWidth: 2,
                            borderRadius: 30,
                            paddingHorizontal: 12,
                            backgroundColor: stateFollow ? COLORS.lightWhite : COLORS.green,
                        }}
                        onPress={handleFollow}
                    >
                        <Text style={{ fontSize: FONT_SIZE.small, fontFamily: FONT.bold }}>
                            {stateFollow ? 'Following' : 'Follow'}
                        </Text>
                    </TouchableOpacity>
                )}
                {threeDotsDisplay && (
                    <TouchableOpacity onPress={openOption}>
                        <Entypo
                            name="dots-three-vertical"
                            size={24}
                            color="black"
                            style={{ marginTop: 3 }}
                        ></Entypo>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default UserIcon;
