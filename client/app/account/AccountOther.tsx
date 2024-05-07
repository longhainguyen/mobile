import {
    View,
    Text,
    ScrollView,
    Dimensions,
    Animated,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../constants';
import InfoAccount from '../../compoments/InfoAccount';
import UserData from '../../dataTemp/UserData';
import ButtonBack from '../../compoments/ButtonBack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IPost } from '../../type/Post.type';
import { useEffect, useRef, useState } from 'react';
import { getDataById } from '../../api/getPost';
import UserIcon from '../../compoments/UserIcon';
import PostContent from '../../compoments/PostContent';
import Interact from '../../compoments/Interact';

type AccountOtherProps = {
    route: any;
    navigation: any;
};

const { height, width } = Dimensions.get('window');

const AccountOther = ({ route, navigation }: AccountOtherProps) => {
    const { avatar, isFollowed, isOwner, userName, idUser } = route.params;
    const scrollY = new Animated.Value(0);
    const translateY = scrollY.interpolate({
        inputRange: [0, 45],
        outputRange: [0, -45],
    });
    const [postList, setPostList] = useState<IPost[]>();
    const flatListRef = useRef<FlatList>(null);
    const [refreshControl, setRefreshControl] = useState(false);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const getData = async (_limit: number, _page: number, idUser: string) => {
        // const postList: IPost[] = (await getDataById(_page, _limit, idUser)) || [];
        setPostList(await getDataById(_page, _limit, idUser, postList || []));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const postList: IPost[] = (await getDataById(0, 5, stateUser.id)) || [];
                setPostList(await getDataById(0, 5, idUser, postList || []));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [idUser]);

    const renderSeparator = () => {
        return (
            <View
                style={{
                    height: height / 2,
                }}
            />
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, marginTop: 15, backgroundColor: COLORS.white }}>
            <ButtonBack title={userName} onBack={() => navigation.goBack()} />

            <Animated.View
                style={{
                    elevation: 4,
                    zIndex: 100,
                    transform: [{ translateY: translateY }],
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        left: 0,
                        height: height / 2,
                    }}
                >
                    <View style={{ height: height / 13 }}></View>
                    <InfoAccount
                        isOwn={false}
                        avatar={{ uri: avatar }}
                        cover={UserData[1].background}
                        name={userName}
                    />
                </View>
            </Animated.View>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={refreshControl}
                        onRefresh={async () => {
                            setRefreshControl(true);
                            setPostList([]);
                            setPage(0);
                            console.log(page, 'at account');
                            setPostList([]);
                            await getData(5, page, idUser);
                            setTimeout(async () => {
                                setRefreshControl(false);
                            }, 2000);
                        }}
                        colors={[COLORS.green]}
                    />
                }
                ListFooterComponent={
                    isLoading ? (
                        <View
                            style={{
                                marginTop: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                padding: 15,
                            }}
                        >
                            <ActivityIndicator size={'large'} color={COLORS.green} />
                        </View>
                    ) : (
                        <View style={{ height: 50 }}></View>
                    )
                }
                onEndReached={async () => {
                    setIsLoading(true);
                    setPage(page + 1);
                    console.log(page, 'at account');

                    await getData(5, page, idUser);
                    setTimeout(async () => {
                        setIsLoading(false);
                    }, 2000);
                }}
                onEndReachedThreshold={0.1}
                ref={flatListRef}
                ListHeaderComponent={renderSeparator}
                onScroll={(e) => {
                    scrollY.setValue(e.nativeEvent.contentOffset.y);
                }}
                data={postList}
                keyExtractor={(item, index) => index.toString()}
                horizontal={false}
                renderItem={({ item }: { item: IPost }) => (
                    <View>
                        <UserIcon
                            avatar={{ uri: item.avartar }}
                            width={30}
                            height={30}
                            isFollowed={false}
                            userName={item.userName}
                            isOwner={true}
                            openAccount={() => {
                                navigation.navigate('Account');
                            }}
                        />
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('ShowPost', {
                                    avatar: item.avartar,
                                    isFollowed: false,
                                    userName: item.userName,
                                    isOwner: true,
                                    images: item.images,
                                    time: item.createAt,
                                    description: item.content,
                                    comment: item.comments,
                                    like: item.likes,
                                    share: item.shares,
                                    postId: item.id,
                                    videos: item.videos,
                                })
                            }
                        >
                            <PostContent
                                videos={item.videos}
                                navigation={navigation}
                                images={item.images}
                                time={item.createAt}
                                description={item.content}
                            />
                        </TouchableOpacity>
                        <Interact
                            comment={item.comments}
                            like={item.likes}
                            share={item.shares}
                            avatar={item.avartar}
                            atHome={true}
                            // openComment={() => openComment(0, item.id, item.avartar)}
                        />
                    </View>
                )}
            ></FlatList>
        </GestureHandlerRootView>
    );
};

export default AccountOther;
