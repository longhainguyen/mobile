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
import { IImage, IPost, IVideo } from '../../type/Post.type';
import { RootState, store } from '../../redux/Store';
import { incremented } from '../../redux/stateLoadMore/statePage';
import { useSelector } from 'react-redux';
import SearchBarComponent from '../../compoments/SearchBar';
import { Video } from 'expo-av';
import { postComment } from '../../api/comment.api';
import { SearchBar } from '@rneui/themed';

const { height, width } = Dimensions.get('window');

export default function Search({ navigation }: any) {
    const [listComment, setListComment] = useState<ItemCommentProps[]>();
    const [postIdOpen, setPostIdOpen] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [refreshControl, setRefreshControl] = useState(false);
    const [postList, setPostList] = useState<IPost[]>();
    const [avartarUserOwnPost, setAvartarUserOwnPost] = useState();
    const [page, setPage] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const stateUser = useSelector((state: RootState) => state.reducerUser);
    const scrollY = new Animated.Value(0);
    const diffClamp = Animated.diffClamp(scrollY, 0, 55);
    const translateY = diffClamp.interpolate({
        inputRange: [0, 55],
        outputRange: [0, -55],
    });

    const scrollToTop = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    };

    useEffect(() => {
        var arr: ItemCommentProps[] = [];
        arr = _list_comments.filter((ele) => ele.post_id === postIdOpen);
        setListComment(arr);
    }, [postIdOpen]);

    const bottemSheet = useRef<BottomSheet>(null);

    const openComment = async (index: number, post_id: string, avatarUserOwn: any) => {
        bottemSheet.current?.snapToIndex(index);
        console.log(post_id);

        setAvartarUserOwnPost(avatarUserOwn);
        setPostIdOpen(post_id);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, marginTop: 15 }}>
            <SearchBarComponent />
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
                            avatar={{ uri: item.avartar }}
                            width={30}
                            height={30}
                            isFollowed={false}
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
                        <Interact
                            isLike={false}
                            postId={parseInt(item.id)}
                            userId={parseInt(stateUser.id)}
                            comment={item.comments}
                            like={item.likes}
                            share={item.shares}
                            avatar={item.avartar}
                            atHome={true}
                            isFollow={item.isFollowed}
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
                            setPostList([]);

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
            />
            <View style={{ height: 50 }}></View>

            <Comment
                userId={parseInt(stateUser.id)}
                postId={postIdOpen}
                dataCommentsOfPost={listComment || []}
                title="Bình luận"
                atSinglePost={false}
                ref={bottemSheet}
                avatar={{ uri: avartarUserOwnPost }}
            />
        </GestureHandlerRootView>
    );
}
