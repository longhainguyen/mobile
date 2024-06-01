import {
    View,
    useWindowDimensions,
    Dimensions,
    TouchableOpacity,
    TextInput,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import _list_comments from '../../dataTemp/CommentData';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { searchPost } from '../../api/search.api';
import { IResultSearch } from '../../type/ResultSearch.type';
import { TabView, SceneMap } from 'react-native-tab-view';
import Users from '../../compoments/common/User';
import Posts from '../../compoments/common/Post';
import UserIcon from '../../compoments/UserIcon';
import { IUser } from '../../type/User.type';

const { height, width } = Dimensions.get('window');

interface Route {
    key: string;
    title: string;
}

interface RenderSceneProps {
    route: Route;
    jumpTo: (key: string) => void;
}

interface SearchProps {
    navigation: any;
    route: any;
}

export default function Search({ navigation, route }: SearchProps) {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<IResultSearch>();
    const layout = useWindowDimensions();
    const [display, setDisplay] = useState(false);

    const [index, setIndex] = useState(0);

    const renderScene = ({ route, jumpTo }: RenderSceneProps) => {
        switch (route.key) {
            case 'users':
                return <Users jumpTo={jumpTo} dataUser={results?.users} />;
            case 'posts':
                return <Posts navigation={navigation} jumpTo={jumpTo} />;
        }
    };

    // const renderScene = SceneMap({
    //     users: Users,
    //     posts: Posts,
    // });
    const [routes] = useState([
        { key: 'users', title: 'Users' },
        { key: 'posts', title: 'Posts' },
    ]);

    const searchPosts = async () => {
        try {
            const results = await searchPost(search, 5, 0);
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

    const handleSubmitSearch = () => {
        setDisplay(true);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
                        onFocus={() => {
                            setDisplay(false);
                        }}
                        onChangeText={setSearch}
                        value={search}
                        placeholderTextColor={COLORS.darkText}
                        placeholder="Tìm kiếm tại đây"
                        onSubmitEditing={handleSubmitSearch}
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
                {display === true ? (
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                    />
                ) : (
                    <View>
                        <FlatList
                            data={results?.users}
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
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}
