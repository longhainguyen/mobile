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
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import BottomSheet from '@gorhom/bottom-sheet';

type AccountOtherProps = {
    route: any;
    navigation: any;
};

const { height, width } = Dimensions.get('window');

const AccountOther = ({ route, navigation }: AccountOtherProps) => {
    const { avatar, isFollowed, isOwner, userName, idUser, cover } = route.params;
    const scrollY = new Animated.Value(0);
    const translateY = scrollY.interpolate({
        inputRange: [0, 45],
        outputRange: [0, -45],
    });
    const [postIdOpen, setPostIdOpen] = useState('');
    const bottemSheetShare = useRef<BottomSheet>(null);
    const stateUser = useSelector((state: RootState) => state.reducerUser);
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

    const openShare = async (
        postId: number,
        idUser: number,
        bottemSheetInstance: BottomSheet | null,
    ) => {
        setPostIdOpen(postId + '');
        bottemSheetInstance?.snapToIndex(0);
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
                        isFollow={isFollowed}
                        isOwn={false}
                        avatar={{ uri: avatar }}
                        cover={{ uri: cover }}
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
                            isFollowed={item.isFollowed}
                            userName={item.userName}
                            isOwner={stateUser.id === item.idUser ? true : false}
                            openAccount={() => {
                                if (stateUser.id === item.idUser) {
                                    navigation.navigate('Account');
                                } else {
                                    navigation.navigate('AccountOther', {
                                        avatar: item.avartar,
                                        isFollowed: item.isFollowed,
                                        isOwner: false,
                                        userName: item.userName,
                                        idUser: item.idUser,
                                        cover: item.background,
                                    });
                                }
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
                                    time: item.createdAt,
                                    description: item.content,
                                    comment: item.comments,
                                    like: item.likes,
                                    isLiked: item.isLiked,
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
                                time={item.createdAt}
                                description={item.content}
                            />
                        </TouchableOpacity>
                        {item.origin && (
                            <View
                                style={{
                                    padding: 10,
                                    marginHorizontal: 10,
                                    marginVertical: 10,
                                    borderWidth: 2,
                                    borderColor: COLORS.borderColor,
                                    borderRadius: 30,
                                }}
                            >
                                <UserIcon
                                    avatar={{ uri: item.origin.user.profile.avatar }}
                                    width={30}
                                    height={30}
                                    isFollowed={item.isFollowed || false}
                                    userName={item.origin.user.username}
                                    isOwner={stateUser.id === item.idUser ? true : false}
                                    openAccount={() => {
                                        if (stateUser.id === item.idUser) {
                                            navigation.navigate('Account');
                                        } else {
                                            navigation.navigate('AccountOther', {
                                                avatar: item.avartar,
                                                isFollowed: false,
                                                isOwner: false,
                                                userName: item.userName,
                                                idUser: item.idUser,
                                            });
                                        }
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate('ShowPost', {
                                            avatar: item.origin?.user.profile.avatar,
                                            isFollowed: item.isFollowed,
                                            userName: item.origin?.user.username,
                                            isOwner:
                                                item.origin?.user.id + '' === stateUser.id
                                                    ? true
                                                    : false,
                                            images: item.origin?.images,
                                            time: item.origin?.createdAt,
                                            description: item.origin?.caption,
                                            comment: item.comments,
                                            like: item.likes,
                                            share: item.shares,
                                            postId: item.id,
                                            videos: item.videos,
                                        })
                                    }
                                >
                                    <PostContent
                                        videos={item.origin.videos}
                                        navigation={navigation}
                                        images={item.origin.images}
                                        time={item.origin.createdAt}
                                        description={item.origin.caption}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                        <Interact
                            isLike={item.isLiked}
                            postId={parseInt(item.id)}
                            userId={parseInt(stateUser.id)}
                            comment={item.comments}
                            like={item.likes}
                            share={item.shares}
                            avatar={item.avartar}
                            atHome={true}
                            isFollow={item.isFollowed}
                            openShare={() => {
                                openShare(
                                    parseInt(item.id),
                                    parseInt(stateUser.id),
                                    bottemSheetShare.current,
                                );
                            }}
                            openComment={
                                () => {}
                                // openComment(0, item.id, item.avartar, bottemSheetComment.current)
                            }
                        />
                    </View>
                )}
            ></FlatList>
        </GestureHandlerRootView>
    );
};

export default AccountOther;
