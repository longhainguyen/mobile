import { useEffect, useRef, useState } from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image,
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Animated,
    Dimensions,
    Platform,
    Modal,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserData from '../../dataTemp/UserData';
import UserIcon from '../../compoments/UserIcon';
import PostContent from '../../compoments/PostContent';
import Interact from '../../compoments/Interact';
import InfoAccount from '../../compoments/InfoAccount';
import BottomSheet from '@gorhom/bottom-sheet';
import Comment, { ItemCommentProps } from '../../compoments/Comment';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import _list_comments from '../../dataTemp/CommentData';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { getDataById } from '../../api/getPost';
import { IImage, IPost, IVideo } from '../../type/Post.type';
import { AntDesign } from '@expo/vector-icons';
import ModalCompoment from '../../compoments/ModalCompoment';
import ShareView from '../../compoments/home/Share';

const { height, width } = Dimensions.get('window');

export default function Account({ navigation }: any) {
    const [listComment, setListComment] = useState<ItemCommentProps[]>();
    const [postIdOpen, setPostIdOpen] = useState('');
    const stateUser = useSelector((state: RootState) => state.reducerUser);
    const [page, setPage] = useState(0);
    const [postList, setPostList] = useState<IPost[]>();
    const flatListRef = useRef<FlatList>(null);
    const [refreshControl, setRefreshControl] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const scrollY = new Animated.Value(0);
    const bottemSheetShare = useRef<BottomSheet>(null);
    const translateY = scrollY.interpolate({
        inputRange: [0, 45],
        outputRange: [0, -45],
    });
    const [modalVisible, setModalVisible] = useState(false);

    const fetchData = async () => {
        try {
            // const postList: IPost[] = (await getDataById(0, 5, stateUser.id)) || [];
            setPostList(await getDataById(0, 5, stateUser.id, postList || []));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (stateUser) {
            fetchData();
        }
    }, [stateUser]);

    useEffect(() => {
        if (stateUser) {
            fetchData();
        }
    }, []);

    const getData = async (_limit: number, _page: number, idUser: string) => {
        // const postList: IPost[] = (await getDataById(_page, _limit, idUser)) || [];
        setPostList(await getDataById(_page, _limit, idUser, postList || []));
    };

    useEffect(() => {
        var arr: ItemCommentProps[] = [];
        arr = _list_comments.filter((ele) => ele.post_id === postIdOpen);
        setListComment(arr);
    }, [postIdOpen]);

    const bottemSheet = useRef<BottomSheet>(null);

    const logout = async () => {
        const userString = await AsyncStorage.getItem('User');
        if (userString) {
            const user = JSON.parse(userString);
            user.isLoggedIn = false;
            await AsyncStorage.setItem('User', JSON.stringify(user));
        }
        setModalVisible(!modalVisible);
        setPage(0);
        navigation.navigate('Login');
    };

    const renderSeparator = (index: any) => {
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
        <GestureHandlerRootView style={{ flex: 1, marginTop: 15 }}>
            <View style={{ backgroundColor: COLORS.white }}>
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
                        <InfoAccount
                            navigation={navigation}
                            idUser={stateUser.id}
                            isFollow={false}
                            isOwn={true}
                            avatar={{ uri: stateUser.profile.avatar }}
                            cover={{ uri: stateUser.profile.background }}
                            name={stateUser.username}
                        />
                        <TouchableOpacity
                            style={{ position: 'absolute', top: 10, right: 10 }}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <AntDesign name="setting" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <ModalCompoment
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    logOut={logout}
                />
                <FlatList
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
                                isFollowed={item.isFollowed || false}
                                userName={item.userName}
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
                                        // isFollowed={item.isFollowed || false}
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
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshControl}
                            onRefresh={async () => {
                                setRefreshControl(true);
                                setPostList([]);
                                setPage(0);
                                console.log(page, 'at account');

                                setPostList([]);
                                await getData(5, page, stateUser.id);
                                setRefreshControl(false);
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

                        console.log(page, 'at account');

                        if (isLoading) {
                            await getData(5, page, stateUser.id).then(() => {
                                if (postList && postList?.length > 0) {
                                    setPage(page + 1);
                                }
                            });
                        }

                        setTimeout(async () => {
                            setIsLoading(false);
                        }, 2000);
                    }}
                    onEndReachedThreshold={0.1}
                />
            </View>

            <Comment
                title="Bình luận"
                atSinglePost={false}
                ref={bottemSheet}
                dataCommentsOfPost={listComment || []}
                avatar={UserData[0].avatar}
            />
            <ShareView
                idUser={stateUser.id}
                navigation={navigation}
                originId={parseInt(postIdOpen)}
                height={30}
                width={30}
                userName={stateUser.username}
                avatar={stateUser.profile.avatar}
                ref={bottemSheetShare}
            />
        </GestureHandlerRootView>
    );
}
