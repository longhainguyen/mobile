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
    Pressable,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import _list_comments from '../../dataTemp/CommentData';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { searchPost } from '../../api/search.api';
import { IPostOfSearch, IResultSearch } from '../../type/ResultSearch.type';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Users from '../../compoments/search/User';
import Posts from '../../compoments/search/Post';
import UserIcon from '../../compoments/UserIcon';
import { IUser } from '../../type/User.type';
import { FONT, FONT_SIZE } from '../../constants/font';
import { IPostHome } from '../../api/getPost';
import PostIcon from '../../compoments/search/PostIcon';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { IHistorySearchItem } from '../../type/historySearch.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistorySearch from '../../compoments/search/HistorySearch';

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
    const stateUser = useSelector((state: RootState) => state.reducerUser);
    const [historySearch, setHistorySearch] = useState<IHistorySearchItem>();

    const [index, setIndex] = useState(0);

    const renderScene = ({ route, jumpTo }: RenderSceneProps) => {
        switch (route.key) {
            case 'users':
                return (
                    <Users
                        keyword={search}
                        jumpTo={jumpTo}
                        dataUser={results?.users}
                        navigation={navigation}
                    />
                );
            case 'posts':
                return <Posts keyWord={search} navigation={navigation} jumpTo={jumpTo} />;
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

    const handleSubmitSearch = async () => {
        setDisplay(true);
        if (search.length > 0) {
            const historyItem: IHistorySearchItem = {
                type: 'text',
                content: search,
            };

            // handleSaveHistorySearch(historyItem);
        }
    };

    const handleSaveHistorySearch = async (historyItem: IHistorySearchItem) => {
        const listHistorySearchString = await AsyncStorage.getItem('HistorySearch');

        if (listHistorySearchString) {
            const listHistorySearch = JSON.parse(listHistorySearchString);
            console.log(listHistorySearch);

            await AsyncStorage.setItem(
                'HistorySearch',
                JSON.stringify(listHistorySearch.push(historyItem)),
            );
        } else {
            await AsyncStorage.setItem('HistorySearch', JSON.stringify([historyItem]));
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1, marginTop: 15, zIndex: -100 }}>
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
                {/* <View>{display === false && search.length === 0 && <HistorySearch />}</View> */}
                {display === true ? (
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={(props) => (
                            <TabBar
                                {...props}
                                indicatorStyle={{ backgroundColor: COLORS.gray }}
                                renderLabel={({ route, focused, color }) => (
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontFamily: FONT.regular,
                                            fontSize: FONT_SIZE.small,
                                        }}
                                    >
                                        {route.title}
                                    </Text>
                                )}
                                style={{
                                    backgroundColor: 'white',
                                    zIndex: 0,
                                }}
                            />
                        )}
                    />
                ) : (
                    <View>
                        <FlatList
                            data={results?.users}
                            renderItem={({ item }: { item: IUser }) => {
                                return (
                                    <View
                                        // onPress={async () => {
                                        //     const historyItem: IHistorySearchItem = {
                                        //         type: 'user',
                                        //         user: item,
                                        //     };
                                        //     // handleSaveHistorySearch(historyItem);
                                        // }}
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
                        <FlatList
                            data={results?.posts}
                            renderItem={({ item }: { item: IPostOfSearch }) => {
                                return (
                                    <TouchableOpacity
                                        onPress={async () => {
                                            // const historyItem: IHistorySearchItem = {
                                            //     type: 'post',
                                            //     post: item,
                                            // };
                                            // handleSaveHistorySearch(historyItem);
                                            navigation.navigate('ShowPost', {
                                                isOwner:
                                                    item.user.id === stateUser.id ? true : false,
                                                postId: item.id,
                                            });
                                        }}
                                        style={{
                                            paddingBottom: 10,
                                            marginHorizontal: 10,
                                        }}
                                    >
                                        <PostIcon
                                            idUserOwn={item.user.id}
                                            navigation={navigation}
                                            id={item.id + ''}
                                            avatar={item.user.profile.avatar}
                                            caption={item.caption}
                                        />
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}
