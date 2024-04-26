import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    FlatList,
    ImageSourcePropType,
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

const { height, width } = Dimensions.get('window');

type ItemProps = {
    source: ImageSourcePropType;
    sources: ImageSourcePropType[];
    index: number;
    navigation: any;
};

export default function Home({ navigation }: any) {
    const [userName, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [listComment, setListComment] = useState<ItemCommentProps[]>();
    const [postIdOpen, setPostIdOpen] = useState('');

    useEffect(() => {
        var arr: ItemCommentProps[] = [];
        arr = _list_comments.filter((ele) => ele.post_id === postIdOpen);
        setListComment(arr);
    }, [postIdOpen]);

    useEffect(() => {
        AsyncStorage.getItem('userName').then((results) => {
            if (results) {
                setUsername(results);
            }
        });

        AsyncStorage.getItem('userId').then((results) => {
            if (results) {
                setUserId(results);
            }
        });

        AsyncStorage.getItem('email').then((results) => {
            if (results) {
                setEmail(email);
            }
        });
    }, []);

    const bottemSheet = useRef<BottomSheet>(null);

    const openComment = (index: number, post_id: string) => {
        bottemSheet.current?.snapToIndex(index);
        setPostIdOpen(post_id);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, marginTop: 15 }}>
            <ScrollView>
                <View
                    style={{
                        marginHorizontal: 10,
                        height: height / 15,
                        borderBottomWidth: 2,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderColor: COLORS.borderColor,
                        flexDirection: 'row',
                        flex: 1,
                    }}
                >
                    <Text style={{ fontFamily: FONT.medium, fontSize: FONT_SIZE.large }}>
                        Social Network
                    </Text>
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

                <UserIcon
                    avatar={UserData[0].avatar}
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
                    openComment={() => openComment(0, '1')}
                />

                <UserIcon
                    avatar={UserData[1].avatar}
                    isFollowed={false}
                    userName={UserData[1].name}
                    isOwner={false}
                    openAccount={() => {
                        navigation.navigate('AccountOther', {
                            avatar: UserData[1].avatar,
                            isFollowed: false,
                            userName: UserData[1].name,
                            isOwner: false,
                        });
                    }}
                />
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('ShowPost', {
                            avatar: UserData[1].avatar,
                            isFollowed: false,
                            userName: UserData[1].name,
                            isOwner: false,
                            images: PostData[1].images,
                            time: PostData[1].time,
                            description: PostData[1].description,
                            comment: PostData[1].comments.length,
                            like: PostData[1].like,
                            share: PostData[1].share,
                            postId: PostData[1].id,
                        })
                    }
                >
                    <PostContent
                        navigation={navigation}
                        images={PostData[1].images}
                        time={PostData[1].time}
                        description={PostData[1].description}
                    />
                </TouchableOpacity>
                <Interact
                    comment={PostData[1].comments.length}
                    like={PostData[1].like}
                    share={PostData[1].share}
                    avatar={UserData[1].avatar}
                    atHome={true}
                    openComment={() => openComment(0, '2')}
                />

                <View style={{ height: 100 }}></View>
            </ScrollView>
            <Comment
                dataCommentsOfPost={listComment || []}
                title="Bình luận"
                atSinglePost={false}
                ref={bottemSheet}
                avatar={UserData[0].avatar}
            />
        </GestureHandlerRootView>
    );
}
