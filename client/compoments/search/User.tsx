import { View, Text, FlatList } from 'react-native';
import React, { useState } from 'react';
import { IResultSearch } from '../../type/ResultSearch.type';
import { searchPost } from '../../api/search.api';
import { IUser } from '../../type/User.type';
import UserIcon from '../UserIcon';
import NoResultsScreen from './NoResultsScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';

interface UsersProp {
    jumpTo: any;
    dataUser?: IUser[];
    keyword: string;
    navigation: any;
}

export default function Users({ keyword, jumpTo, dataUser, navigation }: UsersProp) {
    const stateUser = useSelector((state: RootState) => state.reducerUser);

    return (
        <View>
            {dataUser ? (
                <View>
                    {dataUser.length > 0 ? (
                        <FlatList
                            data={dataUser}
                            renderItem={({ item }: { item: IUser }) => {
                                return (
                                    <View
                                        style={{
                                            paddingBottom: 10,
                                            marginHorizontal: 10,
                                        }}
                                    >
                                        <UserIcon
                                            openAccount={() => {
                                                if (stateUser.id === item.id + '') {
                                                    navigation.navigate('Account');
                                                } else {
                                                    navigation.navigate('AccountOther', {
                                                        avatar: item.profile.avatar,
                                                        cover: item.profile.background,
                                                        isFollowed: false,
                                                        isOwner: false,
                                                        userName: item.username,
                                                        idUser: item.id,
                                                    });
                                                }
                                            }}
                                            id={item.id}
                                            avatar={{ uri: item.profile.avatar }}
                                            height={50}
                                            width={50}
                                            isOwner={false}
                                            userName={item.username}
                                            threeDotsDisplay={false}
                                        />
                                    </View>
                                );
                            }}
                        />
                    ) : (
                        <NoResultsScreen />
                    )}
                </View>
            ) : (
                <NoResultsScreen />
            )}
        </View>
    );
}
