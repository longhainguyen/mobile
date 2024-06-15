import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList,
    Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../constants';
import { AntDesign } from '@expo/vector-icons';
import { IResultSearch } from '../../type/ResultSearch.type';
import { searchPost } from '../../api/search.api';
import { IUser } from '../../type/User.type';
import UserIcon from '../../compoments/UserIcon';
import { Button } from '../../compoments/Themed';

const { height, width } = Dimensions.get('window');

export default function ListUser({ route, navigation }: any) {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<IResultSearch>();
    const [selectedUsers, setSelectUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (route.params.listUser) {
            const listUser: IUser[] = route.params.listUser;
            setSelectUsers(listUser);
        }
    }, []);

    const handleSelectUser = (user: IUser) => {
        if (!selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
            setSelectUsers([...selectedUsers, user]);
        }
    };
    const handleDeleteUser = (user: IUser) => {
        setSelectUsers(selectedUsers.filter((selectedUser) => selectedUser.id !== user.id));
    };

    const handleSave = () => {
        // Implement your save logic here
        // console.log('Saving selected users:', selectedUsers);
        navigation.navigate('Post', {
            selectedUsers: selectedUsers,
        });
    };

    const searchPosts = async () => {
        try {
            const results = await searchPost(search.trim(), 5, 0);
            setResults(results.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (search.length !== 0) {
                await searchPosts();
            } else if (search.length === 0) {
                setResults({
                    posts: [],
                    users: [],
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <View style={{ flex: 1, marginTop: 15 }}>
            <View
                style={{
                    marginHorizontal: 10,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    borderBottomColor: COLORS.borderColor,
                    borderBottomWidth: 2,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>

                <TextInput
                    onChangeText={setSearch}
                    value={search}
                    placeholderTextColor={COLORS.darkText}
                    placeholder="Tìm kiếm tại đây"
                    // onSubmitEditing={handleSubmitSearch}
                    style={{
                        flex: 1,
                        height: 40,
                        margin: 12,
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 20,
                    }}
                />
            </View>
            <View style={{ height: height / 5 }}>
                <FlatList
                    data={results?.users}
                    renderItem={({ item }: { item: IUser }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    handleSelectUser(item);
                                }}
                            >
                                <UserIcon
                                    openAccount={() => {
                                        handleSelectUser(item);
                                    }}
                                    id={item.id}
                                    avatar={{ uri: item.profile.avatar }}
                                    height={50}
                                    width={50}
                                    isOwner={false}
                                    userName={item.username}
                                    threeDotsDisplay={false}
                                />
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            <View style={styles.selectedUsersContainer}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginHorizontal: 15,
                    }}
                >
                    <Text style={styles.selectedUsersText}>Đã chọn {selectedUsers.length}</Text>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={selectedUsers}
                    renderItem={({ item }: { item: IUser }) => {
                        return (
                            <View
                                style={[
                                    styles.userIconContainer,
                                    { justifyContent: 'space-between' },
                                ]}
                            >
                                <UserIcon
                                    openAccount={() => {}}
                                    id={item.id}
                                    avatar={{ uri: item.profile.avatar }}
                                    height={50}
                                    width={50}
                                    isOwner={false}
                                    userName={item.username}
                                    threeDotsDisplay={false}
                                />
                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={() => {
                                        handleDeleteUser(item);
                                    }}
                                >
                                    <AntDesign name="deleteuser" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    style={styles.flatList}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatList: {
        height: height / 2, // Set the height to half of the screen height
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    userIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    listContainer: {
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        marginHorizontal: 10,
    },
    saveButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },

    selectedUsersContainer: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },

    selectedUsersText: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
});
