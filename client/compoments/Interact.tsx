import {
    TouchableOpacity,
    View,
    Text,
    Pressable,
    Image,
    Dimensions,
    Modal,
    Keyboard,
    ScrollView,
    ImageSourcePropType,
    TextInput,
    PanResponder,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { FONT, FONT_SIZE } from '../constants/font';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { likePost } from '../api/getPost';
import ShareView from './home/Share';

const { height, width } = Dimensions.get('window');

interface InteractProp {
    share: string[];
    like: number;
    postId: number;
    userId: number;
    isLike: boolean;
    isFollow: boolean;
    comment: number;
    borderTopWidth?: number;
    avatar: any;
    atHome?: boolean;
    openShare?: () => void;
    openComment?: () => void;
}

const Interact: React.FC<InteractProp> = ({
    borderTopWidth,
    share,
    like,
    comment,
    openComment,
    postId,
    userId,
    isLike,
    isFollow,
    avatar,
    openShare,
    atHome = false,
}) => {
    const [openShareView, setOpenShareView] = useState(false);
    const [_isLike, set_Islike] = useState(isLike);
    const [likeCount, setLikeCount] = useState(like);

    const handleLike = async () => {
        const response = await likePost({
            postId: postId,
            userId: userId,
        });
        if (response.status === 201) {
            if (!_isLike) {
                setLikeCount(likeCount + 1);
            }
            if (_isLike) {
                setLikeCount(likeCount - 1);
            }

            set_Islike(!_isLike);
        }
    };

    const handleSharePost = (postId: number) => {
        console.log(postId);
    };

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 10,
                borderColor: COLORS.borderColor,
                paddingVertical: 15,
                paddingHorizontal: 15,
                borderBottomWidth: 1,
                borderTopWidth: borderTopWidth,
                backgroundColor: COLORS.lightWhite,
            }}
        >
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={openShare}
            >
                <AntDesign
                    name="sharealt"
                    size={18}
                    color="black"
                    style={{
                        marginBottom: 2,
                    }}
                />
                <Text
                    style={{
                        marginLeft: 5,
                        fontFamily: FONT.regular,
                        textAlign: 'center',
                        fontSize: FONT_SIZE.small,
                    }}
                >
                    {share.length}
                </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={handleLike}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {_isLike ? (
                        <AntDesign name="heart" size={18} color="red" />
                    ) : (
                        <AntDesign
                            name="hearto"
                            size={18}
                            color="black"
                            style={{
                                marginBottom: 2,
                            }}
                        />
                    )}

                    <Text
                        style={{
                            textAlign: 'center',
                            marginLeft: 5,
                            fontFamily: FONT.regular,
                            fontSize: FONT_SIZE.small,
                        }}
                    >
                        {likeCount + ''}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        marginLeft: 15,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={openComment}
                >
                    <EvilIcons
                        name="comment"
                        size={24}
                        color="black"
                        style={{
                            marginBottom: 7,
                        }}
                    />
                    <Text
                        style={{
                            marginLeft: 5,
                            fontFamily: FONT.regular,
                            textAlign: 'center',
                            fontSize: FONT_SIZE.small,
                        }}
                    >
                        {comment + ''}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Interact;
