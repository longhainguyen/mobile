import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    FlatList,
    RefreshControl,
    ImageSourcePropType,
    ActivityIndicator,
} from 'react-native';
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
import { IImage, IPost, IVideo } from '../../type/Post.type';
import { RootState, store } from '../../redux/Store';
import { incremented } from '../../redux/stateLoadMore/statePage';
import { useSelector } from 'react-redux';
import { Video } from 'expo-av';

const { height, width } = Dimensions.get('window');

export default function Home({ navigation }: any) {
    const [listComment, setListComment] = useState<ItemCommentProps[]>();
    const [postIdOpen, setPostIdOpen] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [refreshControl, setRefreshControl] = useState(false);
    const [postList, setPostList] = useState<IPost[]>();
    const [avartarUserOwnPost, setAvartarUserOwnPost] = useState();
    const [page, setPage] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const scrollToTop = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    };

    useEffect(() => {
        getData(0);
    }, []);

    const getData = async (_page: number) => {
        request
            .get(`/posts/get-posts?limit=5&page=${_page}`)
            .then((result) => {
                var _postList: IPost[] = []; // Initialize _postList

                result.data.map((post: any) => {
                    const _images: IImage[] = post.images.map((image: any) => {
                        const _image: IImage = {
                            id: image.id,
                            uri: image.url,
                            type: 'image',
                        };
                        return _image;
                    });

                    const _videos: IVideo[] = post.videos.map((video: any) => {
                        const _video: IVideo = {
                            id: video.id,
                            uri: video.url,
                            type: 'video',
                        };
                        return _video;
                    });
                    const _post: IPost = {
                        id: post.id,
                        content: post.caption,
                        comments: post.commentCount,
                        likes: post.likeCount,
                        shares: post.shares,
                        createAt: post.createdAt,
                        avartar: post.user.profile.avatar,
                        idUser: post.user.id,
                        userName: post.user.username,
                        images: _images,
                        videos: _videos,
                    };
                    _postList.push(_post);
                });
                if (_page === 0) {
                    setPostList([]);
                    console.log('refresh home');
                    setPostList(_postList);
                } else {
                    // setPage(0);
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

    const bottemSheet = useRef<BottomSheet>(null);

    const openComment = (index: number, post_id: string, avatarUserOwn: any) => {
        bottemSheet.current?.snapToIndex(index);
        setAvartarUserOwnPost(avatarUserOwn);
        setPostIdOpen(post_id);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, marginTop: 15 }}>
            <View
                style={{
                    marginHorizontal: 10,
                    height: height / 15,
                    borderBottomWidth: 2,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderColor: COLORS.borderColor,
                    flexDirection: 'row',
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

            <FlatList
                ref={flatListRef}
                onViewableItemsChanged={({ viewableItems }) => {
                    console.log(viewableItems);
                }}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 70 }}
                data={postList}
                keyExtractor={(item, index) => index.toString()}
                horizontal={false}
                renderItem={({ item }) => (
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
                            openComment={() => openComment(0, item.id, item.avartar)}
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
                            setTimeout(async () => {
                                setPostList([]);
                                await getData(page);
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
                dataCommentsOfPost={listComment || []}
                title="Bình luận"
                atSinglePost={false}
                ref={bottemSheet}
                avatar={{ uri: avartarUserOwnPost }}
            />
        </GestureHandlerRootView>
    );
}
