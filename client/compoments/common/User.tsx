import { View, Text, FlatList } from 'react-native';
import React, { useState } from 'react';
import { IResultSearch } from '../../type/ResultSearch.type';
import { searchPost } from '../../api/search.api';
import { IUser } from '../../type/User.type';
import UserIcon from '../UserIcon';

interface UsersProp {
    jumpTo: any;
    dataUser?: IUser[];
}

export default function Users({ jumpTo, dataUser }: UsersProp) {
    return (
        <View>
            {dataUser ? (
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
                                    avatar={{ uri: item.profile.avatar }}
                                    height={50}
                                    width={50}
                                    isOwner={false}
                                    openAccount={() => {}}
                                    userName={item.username}
                                    threeDotsDisplay={false}
                                />
                            </View>
                        );
                    }}
                />
            ) : (
                <View>
                    <Text>Chưa có kết quả nào</Text>
                </View>
            )}
        </View>
    );
}
