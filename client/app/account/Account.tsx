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
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';

export default function Account({ navigation }: any) {
    const [user, setUser] = useState<IUser>();
    const [listComment, setListComment] = useState<ItemCommentProps[]>();
    const [postIdOpen, setPostIdOpen] = useState('');
    const stateUser = useSelector((state: RootState) => state.reducerUser);

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
        const fetchUserData = async () => {
            try {
                const userString = await AsyncStorage.getItem('User');
                if (userString) {
                    const user = JSON.parse(userString);
                    setUser(user);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1, marginTop: 15 }}>
            <ScrollView style={{ backgroundColor: COLORS.white }}>
                <InfoAccount
                    isOwn={true}
                    avatar={{ uri: stateUser.profile.avatar }}
                    cover={{ uri: stateUser.profile.background }}
                    name={stateUser.username}
                />
                <UserIcon
                    avatar={{ uri: stateUser.profile.avatar }}
                    isFollowed={false}
                    userName={stateUser.username}
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
