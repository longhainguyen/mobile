import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { COLORS } from '../constants';
import { FONT } from '../constants/font';
import User from '../dataTemp/User';

interface UserProp {
    userName: string;
    avatar: any;
    isFollowed: boolean;
}

const UserIcon: React.FC<UserProp> = ({ userName, avatar, isFollowed }) => {
    return (
        <View
            style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginHorizontal: 10,
                marginTop: 20,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Image
                    source={avatar}
                    style={{
                        borderRadius: 50,
                        height: 55,
                        width: 55,
                        borderWidth: 2,
                        borderColor: COLORS.background,
                    }}
                />
                <Text style={{ fontSize: 13, fontFamily: FONT.bold, marginLeft: 7 }}>
                    {userName}
                </Text>
            </View>
            <View
                style={{
                    borderColor: COLORS.borderColor,
                    borderWidth: 2,
                    borderRadius: 30,
                    paddingHorizontal: 12,
                    backgroundColor: isFollowed ? COLORS.lightWhite : COLORS.green,
                }}
            >
                <Text style={{ fontSize: 13, fontFamily: FONT.bold }}>
                    {isFollowed ? 'Following' : 'Follow'}
                </Text>
            </View>
        </View>
    );
};

export default UserIcon;
