import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserData from '../../dataTemp/UserData';
import UserIcon from '../../compoments/UserIcon';
import PostData from '../../dataTemp/PostData';
import PostContent from '../../compoments/PostContent';
import Interact from '../../compoments/Interact';
import InfoAccount from '../../compoments/InfoAccount';
import BottomSheet from '@gorhom/bottom-sheet';
import Comment, { ItemCommentProps } from '../../compoments/Comment';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import _list_comments from '../../dataTemp/CommentData';
import { IUser } from '../../type/User.type';

export default function Account({ navigation }: any) {
    const [user, setUser] = useState<IUser>();
    const [listComment, setListComment] = useState<ItemCommentProps[]>();
    const [postIdOpen, setPostIdOpen] = useState('');

    useEffect(() => {
        var arr: ItemCommentProps[] = [];
        arr = _list_comments.filter((ele) => ele.post_id === postIdOpen);
        setListComment(arr);
    }, [postIdOpen]);

    const bottemSheet = useRef<BottomSheet>(null);

    const openComment = (index: number, post_id: string) => {
        bottemSheet.current?.snapToIndex(index);
        setPostIdOpen(post_id);
    };

    const logout = async () => {
        const userString = await AsyncStorage.getItem('User');
        if (userString) {
            const user = JSON.parse(userString);
            user.isLoggedIn = false;
            await AsyncStorage.setItem('User', JSON.stringify(user));
        }
        navigation.navigate('Login');
    };

    useEffect(() => {
        AsyncStorage.getItem('User').then((userString) => {
            if (userString) {
                const user = JSON.parse(userString);
                setUser(user);
            }
        });
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1, marginTop: 15 }}>
            <ScrollView style={{ backgroundColor: COLORS.white }}>
                <InfoAccount
                    isOwn={true}
                    avatar={
                        user?.profile.avatar ? { uri: user?.profile.avatar } : UserData[0].avatar
                    }
                    cover={
                        user?.profile.background
                            ? { uri: user?.profile.background }
                            : UserData[0].background
                    }
                    name={user?.username ? user?.username : ''}
                />
                <UserIcon
                    avatar={
                        user?.profile.avatar ? { uri: user?.profile.avatar } : UserData[0].avatar
                    }
                    isFollowed={false}
                    userName={UserData[0].name}
                    isOwner={true}
                    openAccount={() => {
                        navigation.navigate('Account');
                    }}
                />
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('ShowPost', {
                            avatar: UserData[0].avatar,
                            isFollowed: false,
                            userName: UserData[0].name,
                            isOwner: true,
                            images: PostData[0].images,
                            time: PostData[0].time,
                            description: PostData[0].description,
                            comment: PostData[0].comments.length,
                            like: PostData[0].like,
                            share: PostData[0].share,
                            postId: PostData[0].id,
                        })
                    }
                >
                    <PostContent
                        navigation={navigation}
                        images={PostData[0].images}
                        time={PostData[0].time}
                        description={PostData[0].description}
                    />
                </TouchableOpacity>
                <Interact
                    comment={PostData[0].comments.length}
                    like={PostData[0].like}
                    share={PostData[0].share}
                    avatar={UserData[0].avatar}
                    atHome={true}
                    openComment={() => openComment(0, PostData[0].id + '')}
                />

                <TouchableOpacity
                    style={{ marginTop: 100, padding: 30, backgroundColor: COLORS.redButton }}
                    onPress={logout}
                >
                    <Text>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
            <Comment
                title="Bình luận"
                atSinglePost={false}
                ref={bottemSheet}
                dataCommentsOfPost={listComment || []}
                avatar={UserData[0].avatar}
            />
        </GestureHandlerRootView>
    );
}
