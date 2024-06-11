import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { IPost } from '../../type/Post.type';
import UserIcon from '../UserIcon';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import PostContent from '../PostContent';
import { COLORS } from '../../constants';
import Interact from '../Interact';
import { searchPost } from '../../api/search.api';
import { IPostOfSearch } from '../../type/ResultSearch.type';
import NoResultsScreen from './NoResultsScreen';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Comment from '../../compoments/Comment';
import ShareView from '../../compoments/home/Share';
import Option from '../../compoments/home/Option';

interface PostsProp {
    navigation: any;
    jumpTo: any;
    keyWord: string;
}

export default function Posts({ keyWord, navigation, jumpTo }: PostsProp) {
    const flatListRef = useRef<FlatList>(null);
    const [postList, setPostList] = useState<IPost[]>();
    const stateUser = useSelector((state: RootState) => state.reducerUser);
    // const [refreshControl, setRefreshControl] = useState(false);
    // const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [lengthComment, setLengthComment] = useState(0);
    const [avartarUserOwnPost, setAvartarUserOwnPost] = useState();
    const [postOpen, setPostOpen] = useState<IPost>();
    const bottemSheetComment = useRef<BottomSheet>(null);
    const bottemSheetShare = useRef<BottomSheet>(null);
    const bottemSheetOption = useRef<BottomSheet>(null);
    const [postIdOpen, setPostIdOpen] = useState('');
    const [idUserOfPost, setIdUserOfPost] = useState('');

    useEffect(() => {
        if (keyWord) {
            try {
                getDataByKeyWord();
            } catch (error) {
                console.log(error);
            }
        }
    }, []);

    const getDataByKeyWord = async () => {
        try {
            const response = await searchPost(keyWord, 5, 0);
            // console.log(response.data.posts);
            var _postList: IPost[] = []; // Initialize _postList
            response.data.posts.map((post: IPostOfSearch) => {
                const _post: IPost = {
                    id: post.id + '',
                    content: post.caption,
                    comments: post.commentCount,
                    likes: post.likeCount,
                    shares: post.shareds,
                    background: post.user.profile.background,
                    avartar: post.user.profile.avatar,
                    idUser: post.user.id + '',
                    userName: post.user.username,
                    images: post.images,
                    videos: post.videos,
                    isFollowed: post.isFollowed,
                    isLiked: post.isLiked,
                    createdAt: post.createdAt,
                    origin: post.origin,
                    isPublic: post.isPublic,
                };
                _postList.push(_post);
            });
            setPostList(_postList);
        } catch (error) {
            console.log(error);
        }
    };

    const openComment = async (
        index: number,
        post_id: string,
        avatarUserOwn: any,
        postOpen: IPost,
        bottemSheetInstance: BottomSheet | null,
        lengthComment: number,
    ) => {
        setLengthComment(lengthComment);
        setPostOpen(postOpen);
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
        <GestureHandlerRootView style={{ flex: 1 }}>
            {postList && postList?.length > 0 ? (
                <FlatList
                    ref={flatListRef}
                    ListHeaderComponent={() => {
                        return <View style={{ height: 50 }}></View>;
                    }}
                    data={postList}
                    keyExtractor={(item, index) => {
                        return index.toString();
                    }}
                    horizontal={false}
                    renderItem={({ item }: { item: IPost }) => (
                        <Pressable>
                            <UserIcon
                                id={item.idUser}
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
                                        isOwner: item.idUser === stateUser.id ? true : false,
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
                                        id={item.origin.user.id + ''}
                                        idUserOfPost={item.idUser}
                                        avatar={{ uri: item.origin.user.profile.avatar }}
                                        width={30}
                                        height={30}
                                        threeDotsDisplay={false}
                                        userName={item.origin.user.username}
                                        isOwner={stateUser.id === item.idUser ? true : false}
                                        openAccount={() => {
                                            if (stateUser.id === item.origin?.user.id + '') {
                                                navigation.navigate('Account');
                                            } else {
                                                navigation.navigate('AccountOther', {
                                                    avatar: item.avartar,
                                                    cover: item.background,
                                                    isFollowed: item.isFollowed,
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
                                    openComment(
                                        0,
                                        item.id,
                                        stateUser.profile.avatar,
                                        item,
                                        bottemSheetComment.current,
                                        item.comments,
                                    )
                                }
                            />
                        </Pressable>
                    )}
                    // refreshControl={
                    //     <RefreshControl
                    //         refreshing={refreshControl}
                    //         onRefresh={async () => {
                    //             if (stateUser.id) {
                    //                 setRefreshControl(true);
                    //                 setPostList([]);
                    //                 setPage(0);
                    //                 setPostList([]);
                    //                 await getData(page);
                    //             }

                    //             setTimeout(async () => {
                    //                 setRefreshControl(false);
                    //             }, 2000);
                    //         }}
                    //         colors={[COLORS.green]}
                    //     />
                    // }
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
                    // onEndReached={async () => {
                    //     if (postList) {
                    //         setIsLoading(true);
                    //         console.log(page, 'at home');

                    //         await getData(page).then(() => {
                    //             setPage(page + 1);
                    //         });
                    //         setTimeout(async () => {
                    //             setIsLoading(false);
                    //         }, 2000);
                    //     }
                    // }}
                    // onEndReachedThreshold={0.1}
                />
            ) : (
                <NoResultsScreen />
            )}
            <Comment
                postOpen={postOpen}
                userId={parseInt(stateUser.id)}
                postId={postIdOpen}
                lengthComment={lengthComment}
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
