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

const { height, width } = Dimensions.get('window');

type ShowPostProps = {
    route: any;
    navigation: any;
};

const ShowPost = ({ route, navigation }: ShowPostProps) => {
    const {
        avatar,
        comment,
        description,
        images,
        isFollowed,
        isOwner,
        like,
        share,
        time,
        isLiked,
        userName,
        postId,
        videos,
    } = route.params;
    const stateUser = useSelector((state: RootState) => state.reducerUser);

    const bottemSheet = useRef<BottomSheet>(null);
    console.log(route.params);

    const openComment = (index: number, post_id: string) => {
        bottemSheet.current?.snapToIndex(index);
        setPostIdOpen(post_id);
    };

    const [listComment, setListComment] = useState<ItemCommentProps[]>();
    const [postIdOpen, setPostIdOpen] = useState('');
    console.log(postIdOpen);

    useEffect(() => {
        var arr: ItemCommentProps[] = [];
        arr = _list_comments.filter((ele) => ele.post_id == postIdOpen);
        setListComment(arr);
    }, [postIdOpen]);

    useEffect(() => {
        bottemSheet.current?.close;
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1, marginTop: 15 }}>
            <ButtonBack title="Post" onBack={() => navigation.goBack()} />

            <ScrollView>
                <View style={{ height: 55 }}></View>
                <UserIcon
                    avatar={{ uri: avatar }}
                    isFollowed={isFollowed}
                    userName={userName}
                    isOwner={isOwner}
                    openAccount={() => {
                        if (isOwner) {
                            navigation.navigate('Account');
                        } else {
                            navigation.navigate('AccountOther');
                        }
                    }}
                />

                <PostContent
                    videos={videos}
                    navigation={navigation}
                    images={images}
                    time={time}
                    description={description}
                />
                <View style={{ height: 100 }}></View>
            </ScrollView>

            <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                <Interact
                    isFollow={isFollowed}
                    isLike={isLiked}
                    postId={postId}
                    userId={parseInt(stateUser.id)}
                    atHome={false}
                    borderTopWidth={1}
                    comment={comment}
                    like={like}
                    share={share}
                    avatar={avatar}
                    openComment={() => openComment(0, postId)}
                />
            </View>
            <Comment
                title="Bình luận"
                atSinglePost={true}
                ref={bottemSheet}
                avatar={{ uri: avatar }}
                dataCommentsOfPost={listComment || []}
            />
        </GestureHandlerRootView>
    );
};

export default ShowPost;
