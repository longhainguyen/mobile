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
import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { COLORS } from '../../constants';
import Comment from '../../compoments/Comment';

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
        userName,
    } = route.params;

    const bottemSheet = useRef<BottomSheet>(null);

    const openComment = (index: number) => {
        bottemSheet.current?.snapToIndex(index);
    };

    useEffect(() => {
        bottemSheet.current?.close;
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1, marginTop: 15 }}>
            <ButtonBack title="Post" onBack={() => navigation.goBack()} />

            <ScrollView>
                <View style={{ height: 55 }}></View>
                <UserIcon
                    avatar={avatar}
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
                    navigation={navigation}
                    images={images}
                    time={time}
                    description={description}
                />
                <View style={{ height: 100 }}></View>
            </ScrollView>

            <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                <Interact
                    borderTopWidth={1}
                    comment={comment}
                    like={like}
                    share={share}
                    avatar={avatar}
                    openComment={() => openComment(0)}
                />
            </View>
            <Comment title="Bình luận" atHome={false} ref={bottemSheet} avatar={avatar} />
        </GestureHandlerRootView>
    );
};

export default ShowPost;
