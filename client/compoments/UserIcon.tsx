import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { COLORS } from '../constants';
import { FONT, FONT_SIZE } from '../constants/font';
import { Entypo } from '@expo/vector-icons';

interface UserProp {
    userName: string;
    avatar: ImageSourcePropType;
    isFollowed: boolean;
    isOwner: boolean;
    width?: number;
    height?: number;
    openAccount: () => void;
}

const UserIcon: React.FC<UserProp> = ({
    width = 55,
    height = 55,
    userName,
    avatar,
    isFollowed,
    isOwner,
    openAccount,
}) => {
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
                            backgroundColor: isFollowed ? COLORS.lightWhite : COLORS.green,
                        }}
                    >
                        <Text style={{ fontSize: FONT_SIZE.small, fontFamily: FONT.bold }}>
                            {isFollowed ? 'Following' : 'Follow'}
                        </Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity>
                    <Entypo
                        name="dots-three-vertical"
                        size={24}
                        color="black"
                        style={{ marginTop: 3 }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default UserIcon;
