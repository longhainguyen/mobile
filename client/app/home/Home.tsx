import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    FlatList,
    ListRenderItem,
    RefreshControl,
    ImageSourcePropType,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants';
import UserIcon from '../../compoments/UserIcon';
import { FONT, FONT_SIZE } from '../../constants/font';
import UserData from '../../dataTemp/UserData';
import PostData from '../../dataTemp/PostData';
import PostContent from '../../compoments/PostContent';
import Interact from '../../compoments/Interact';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import Comment, { ItemCommentProps } from '../../compoments/Comment';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import _list_comments from '../../dataTemp/CommentData';
import { EvilIcons } from '@expo/vector-icons';
import request from '../../config/request';
import { IFile, IImage, IPost, IVideo } from '../../type/Post.type';
import { RootState, store } from '../../redux/Store';
import { incremented } from '../../redux/stateLoadMore/statePage';
import { useSelector } from 'react-redux';
import SwitchComponent from '../../compoments/SearchBar';
import { Video } from 'expo-av';
import { postComment } from '../../api/comment.api';
import { IPostHome, getPostHome } from '../../api/getPost';
import ShareView from '../../compoments/home/Share';
import Option from '../../compoments/home/Option';
import { SearchBar } from '@rneui/themed';

const { height, width } = Dimensions.get('window');

export default function Home({ navigation }: any) {
    const [listComment, setListComment] = useState<ItemCommentProps[]>();
    const [postIdOpen, setPostIdOpen] = useState('');
    const [idUserOfPost, setIdUserOfPost] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [refreshControl, setRefreshControl] = useState(false);
    const [postList, setPostList] = useState<IPost[]>();
    const [avartarUserOwnPost, setAvartarUserOwnPost] = useState();
    const [page, setPage] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const stateUser = useSelector((state: RootState) => state.reducerUser);
    const bottemSheetComment = useRef<BottomSheet>(null);
    const bottemSheetShare = useRef<BottomSheet>(null);
    const bottemSheetOption = useRef<BottomSheet>(null);
    const scrollY = new Animated.Value(0);
    const diffClamp = Animated.diffClamp(scrollY, 0, 55);
    const translateY = diffClamp.interpolate({
        inputRange: [0, 55],
        outputRange: [0, -55],
    });
    const [postOpen, setPostOpen] = useState<IPost>();

    const scrollToTop = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    };

    useEffect(() => {
        if (stateUser.id) {
            getData(0);
        }
    }, []);

    const getData = async (_page: number) => {
        await getPostHome(stateUser.id, 5, _page)
            .then((result) => {
                var _postList: IPost[] = []; // Initialize _postList

                result.data.map((post: IPostHome) => {
                    const _post: IPost = {
                        id: post.id + '',
                        content: post.caption,
                        comments: post.commentCount,
                        likes: post.likeCount,
                        shares: post.shareds,

                        avartar: post.user.profile.avatar,
                        idUser: post.user.id + '',
                        userName: post.user.username,
                        images: post.images,
                        videos: post.videos,
                        isFollowed: post.isFollowed,
                        isLiked: post.isLiked,
                        createdAt: post.createdAt,
                        origin: post.origin,
                    };
                    _postList.push(_post);
                });
                if (_page === 0) {
                    setPostList([]);
                    console.log('refresh home');
                    setPostList(_postList);
                } else {
                    const postListAfterConcat = postList?.concat(_postList);
                    setPostList(postListAfterConcat);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(() => {
        var arr: ItemCommentProps[] = [];
        arr = _list_comments.filter((ele) => ele.post_id === postIdOpen);
        setListComment(arr);
    }, [postIdOpen]);

    const openComment = async (
        index: number,
        post_id: string,
        avatarUserOwn: any,
        bottemSheetInstance: BottomSheet | null,
    ) => {
        bottemSheetInstance?.snapToIndex(index);
        setAvartarUserOwnPost(avatarUserOwn);
        setPostIdOpen(post_id);
    };

    const openShare = async (
        postId: number,
        idUser: number,
        bottemSheetInstance: BottomSheet | null,
    ) => {
        setPostIdOpen(postId + '');
        bottemSheetInstance?.snapToIndex(0);
    };

    const handleOpenOption = async (
        idUser: string,
        post: IPost,
        bottemSheetInstance: BottomSheet | null,
    ) => {
        setIdUserOfPost(idUser);
        setPostOpen(post);
        bottemSheetInstance?.snapToIndex(0);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, marginTop: 15 }}>
            <Animated.View
                style={{
                    transform: [{ translateY: translateY }],
                    elevation: 4,
                    zIndex: 100,
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        marginHorizontal: 10,
                        height: height / 15,
                        borderBottomWidth: 2,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderColor: COLORS.borderColor,
                        flexDirection: 'row',
                        backgroundColor: COLORS.lightWhite,
                    }}
                >
                    <TouchableOpacity onPress={scrollToTop}>
                        <Text style={{ fontFamily: FONT.medium, fontSize: FONT_SIZE.large }}>
                            Social Network
                        </Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', gap: 3 }}>
                        <TouchableOpacity
                            style={{ padding: 5 }}
                            onPress={() => {
                                navigation.navigate('Search');
                            }}
                        >
                            <EvilIcons name="search" size={26} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ padding: 5 }}
                            onPress={() => {
                                navigation.navigate('Inform');
                            }}
                        >
                            <EvilIcons name="bell" size={26} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
            <FlatList
                ref={flatListRef}
                ListHeaderComponent={() => {
                    return <View style={{ height: 50 }}></View>;
                }}
                onScroll={(e) => {
                    scrollY.setValue(e.nativeEvent.contentOffset.y);
                }}
                data={postList}
                keyExtractor={(_item, index) => {
                    // const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9);
                    return index.toString();
                }}
                horizontal={false}
                renderItem={({ item }: { item: IPost }) => (
                    <View>
                        <UserIcon
                            idUserOfPost={item.idUser}
                            openOption={() => {
                                handleOpenOption(item.idUser, item, bottemSheetOption.current);
                            }}
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
                                    idUserOfPost={item.idUser}
                                    avatar={{ uri: item.origin.user.profile.avatar }}
                                    width={30}
                                    height={30}
                                    threeDotsDisplay={false}
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
                            openComment={() =>
                                openComment(0, item.id, item.avartar, bottemSheetComment.current)
                            }
                        />
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshControl}
                        onRefresh={async () => {
                            if (stateUser.id) {
                                setRefreshControl(true);
                                setPostList([]);
                                setPage(0);
                                setPostList([]);
                                await getData(page);
                            }

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
                    ) : null
                }
                onEndReached={async () => {
                    setIsLoading(true);
                    setPage(page + 1);
                    await getData(page);
                    setTimeout(async () => {
                        setIsLoading(false);
                    }, 2000);
                }}
                onEndReachedThreshold={0.1}
            />
            <View style={{ height: 50 }}></View>

            <Comment
                userId={parseInt(stateUser.id)}
                postId={postIdOpen}
                dataCommentsOfPost={listComment || []}
                title="Bình luận"
                atSinglePost={false}
                ref={bottemSheetComment}
                avatar={{ uri: avartarUserOwnPost }}
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
            <Option
                navigation={navigation}
                idUserOfPost={idUserOfPost}
                idUser={stateUser.id}
                ref={bottemSheetOption}
                post={postOpen}
            />
        </GestureHandlerRootView>
    );
}
