import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image,
    Modal,
    Pressable,
    Alert,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import ButtonBack from '../../compoments/ButtonBack';
import UserIcon from '../../compoments/UserIcon';
import PostContent from '../../compoments/PostContent';
import Interact from '../../compoments/Interact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { COLORS } from '../../constants';
import Comment, { ItemCommentProps } from '../../compoments/Comment';
import _list_comments from '../../dataTemp/CommentData';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { IPostOfSearch } from '../../type/ResultSearch.type';
import { getSinglePost } from '../../api/getPost';
import ShareView from '../../compoments/home/Share';
import Option from '../../compoments/home/Option';
import { IPost } from '../../type/Post.type';

const { height, width } = Dimensions.get('window');

type ShowPostProps = {
    route: any;
    navigation: any;
};

const ShowPost = ({ route, navigation }: ShowPostProps) => {
    const { isOwner, postId } = route.params;
    const stateUser = useSelector((state: RootState) => state.reducerUser);
    const [singlePost, setSinglePOst] = useState<IPostOfSearch>();
    const [postIdOpen, setPostIdOpen] = useState('');
    const bottemSheetShare = useRef<BottomSheet>(null);
    const [lengthComment, setLengthComment] = useState(0);
    const bottemSheetComment = useRef<BottomSheet>(null);
    const [avartarUserOwnPost, setAvartarUserOwnPost] = useState();
    const [idUserOfPost, setIdUserOfPost] = useState('');
    const [postOpen, setPostOpen] = useState<IPost>();
    const bottemSheetOption = useRef<BottomSheet>(null);

    useEffect(() => {
        try {
            if (postId) {
                getDataSinglePost();
            }
        } catch (error) {
            console.log(error, 'at show post');
        }
    }, []);

    const getDataSinglePost = async () => {
        try {
            const response = await getSinglePost(postId);
            setSinglePOst(response.data);
        } catch (error) {
            console.log(error, 'at show post');
        }
    };

    const openShare = async (
        postId: number,
        idUser: number,
        bottemSheetInstance: BottomSheet | null,
    ) => {
        setPostIdOpen(postId + '');
        bottemSheetInstance?.snapToIndex(0);
    };

    const openComment = async (
        index: number,
        post_id: string,
        avatarUserOwn: any,
        bottemSheetInstance: BottomSheet | null,
        lengthComment: number,
    ) => {
        setLengthComment(lengthComment);
        bottemSheetInstance?.snapToIndex(index);
        setAvartarUserOwnPost(avatarUserOwn);
        setPostIdOpen(post_id);
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
            <ButtonBack title="Post" onBack={() => navigation.goBack()} />

            <ScrollView>
                <View style={{ height: 55 }}></View>
                <UserIcon
                    openOption={() => {
                        if (singlePost) {
                            handleOpenOption(
                                singlePost.user.id,
                                {
                                    avartar: singlePost.user.profile.avatar,
                                    background: singlePost.user.profile.background,
                                    comments: singlePost.commentCount,
                                    content: singlePost.caption,
                                    createdAt: singlePost.createdAt,
                                    id: singlePost.id + '',
                                    idUser: singlePost.user.id + '',
                                    images: singlePost.images,
                                    isFollowed: singlePost.isFollowed,
                                    isLiked: singlePost.isLiked,
                                    likes: singlePost.likeCount,
                                    shares: singlePost.shareds,
                                    userName: singlePost.user.username,
                                    videos: singlePost.videos,
                                    origin: singlePost.origin,
                                    isPublic: singlePost.isPublic,
                                },
                                bottemSheetOption.current,
                            );
                        }
                    }}
                    id={singlePost?.user.id + ''}
                    avatar={{ uri: singlePost?.user.profile.avatar }}
                    isFollowed={singlePost?.isFollowed}
                    userName={singlePost?.user.username + ''}
                    isOwner={isOwner}
                    openAccount={() => {
                        if (isOwner) {
                            navigation.navigate('Account');
                        } else {
                            navigation.navigate('AccountOther', {
                                avatar: singlePost?.user.profile.avatar,
                                isFollowed: singlePost?.isFollowed,
                                isOwner: false,
                                userName: singlePost?.user.username + '',
                                idUser: singlePost?.user.id,
                                cover: singlePost?.user.profile.background,
                            });
                        }
                    }}
                />

                <PostContent
                    videos={singlePost?.videos || []}
                    navigation={navigation}
                    images={singlePost?.images || []}
                    time={singlePost?.createdAt + ''}
                    description={singlePost?.caption + ''}
                />
                <TouchableOpacity>
                    {singlePost?.origin && (
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
                                id={singlePost.origin.user.id + ''}
                                idUserOfPost={singlePost.user.id}
                                avatar={{ uri: singlePost.origin.user.profile.avatar }}
                                width={30}
                                height={30}
                                threeDotsDisplay={false}
                                userName={singlePost.origin.user.username}
                                isOwner={stateUser.id === singlePost.user.id ? true : false}
                                openAccount={() => {
                                    if (stateUser.id === singlePost.user.id) {
                                        navigation.navigate('Account');
                                    } else {
                                        navigation.navigate('AccountOther', {
                                            avatar: singlePost.user.profile.avatar,
                                            cover: singlePost.user.profile.background,
                                            isFollowed: singlePost.isFollowed,
                                            isOwner: false,
                                            userName: singlePost.user.username,
                                            idUser: singlePost.user.id,
                                        });
                                    }
                                }}
                            />
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('ShowPost', {
                                        avatar: singlePost.origin?.user.profile.avatar,
                                        isFollowed: singlePost.isFollowed,
                                        userName: singlePost.origin?.user.username,
                                        isOwner:
                                            singlePost.origin?.user.id + '' === stateUser.id
                                                ? true
                                                : false,
                                        images: singlePost.origin?.images,
                                        time: singlePost.origin?.createdAt,
                                        description: singlePost.origin?.caption,
                                        comment: singlePost.commentCount,
                                        like: singlePost.likeCount,
                                        share: singlePost.shareds,
                                        postId: singlePost.id,
                                        videos: singlePost.videos,
                                    })
                                }
                            >
                                <PostContent
                                    videos={singlePost.origin.videos}
                                    navigation={navigation}
                                    images={singlePost.origin.images}
                                    time={singlePost.origin.createdAt}
                                    description={singlePost.origin.caption}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>
                <View style={{ height: 100 }}></View>
            </ScrollView>

            <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                <Interact
                    isFollow={singlePost?.isFollowed || false}
                    isLike={singlePost?.isLiked || false}
                    postId={postId}
                    userId={parseInt(stateUser.id)}
                    atHome={false}
                    borderTopWidth={1}
                    comment={singlePost?.commentCount || 0}
                    like={singlePost?.likeCount || 0}
                    share={singlePost?.shareds || []}
                    avatar={singlePost?.user.profile.avatar}
                    openShare={() => {
                        openShare(
                            parseInt(postId + ''),
                            parseInt(stateUser.id),
                            bottemSheetShare.current,
                        );
                    }}
                    openComment={() =>
                        openComment(
                            0,
                            singlePost?.id + '',
                            stateUser.profile.avatar,
                            bottemSheetComment.current,
                            singlePost?.commentCount || 0,
                        )
                    }
                />
            </View>
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
            <Comment
                userId={parseInt(stateUser.id)}
                postId={postIdOpen}
                lengthComment={lengthComment}
                title="Bình luận"
                atSinglePost={false}
                ref={bottemSheetComment}
                avatar={{ uri: avartarUserOwnPost }}
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
};

export default ShowPost;
