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

const { height, width } = Dimensions.get('window');

interface InteractProp {
    share: number;
    like: number;
    comment: number;
    borderTopWidth?: number;
    avatar: any;
    atHome?: boolean;
    openComment?: () => void;
}

const Interact: React.FC<InteractProp> = ({
    borderTopWidth,
    share,
    like,
    comment,
    openComment,
    avatar,
    atHome = false,
}) => {
    const [isKeyboardDidShow, setIsKeyboardDidShow] = useState(false);
    const [viewHeight, setViewHeight] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const snapPoints = useMemo(() => ['40%', '60%', '80%', '100%'], []);

    const bottomSheet = useRef<BottomSheet>(null);

    const onLayout = (event: { nativeEvent: { layout: { height: any } } }) => {
        const { height } = event.nativeEvent.layout;

        setViewHeight(height);
    };

    const turnOffModal = (heightPadding: number) => {
        if (Math.round(heightPadding) == Math.round(height / 5.5)) {
            Keyboard.dismiss();
        } else {
            setModalVisible(!modalVisible);
        }
    };

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
            setKeyboardHeight(event.endCoordinates.height);
            setIsKeyboardDidShow(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
            setIsKeyboardDidShow(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

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
                    {share}
                </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <AntDesign
                        name="hearto"
                        size={18}
                        color="black"
                        style={{
                            marginBottom: 2,
                        }}
                    />
                    <Text
                        style={{
                            textAlign: 'center',
                            marginLeft: 5,
                            fontFamily: FONT.regular,
                            fontSize: FONT_SIZE.small,
                        }}
                    >
                        {like}
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
                        {comment}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                ref={modalRef}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <Pressable
                    onLayout={onLayout}
                    onPress={() => turnOffModal(viewHeight)}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: -1,
                        backgroundColor: modalVisible ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                        opacity: 0.5,
                    }}
                ></Pressable>

                <View
                    style={{
                        backgroundColor: COLORS.white,
                        borderRadius: 20,
                        shadowColor: COLORS.shadowColor,
                        marginTop: atHome ? height - height / 1.03 : height - height / 1.7,
                        height: atHome
                            ? isKeyboardDidShow
                                ? height / 1.03 - keyboardHeight
                                : height / 1.03
                            : isKeyboardDidShow
                            ? height / 1.7 - keyboardHeight
                            : height / 1.7,
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            borderBottomWidth: 2,
                            height: 30,
                            borderColor: COLORS.borderColor,
                            marginHorizontal: 15,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontFamily: FONT.regular,
                                fontSize: FONT_SIZE.small,
                            }}
                        >
                            Bình luận{' '}
                        </Text>
                    </View>
                    <ScrollView
                        style={{ marginTop: 40, maxHeight: atHome ? height / 1.2 : height / 2.3 }}
                    >
                        <View
                            style={{
                                height: 1000,
                                backgroundColor: COLORS.gray,
                                marginHorizontal: 15,
                            }}
                        ></View>
                    </ScrollView>

                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginHorizontal: 10,
                            paddingVertical: 10,
                        }}
                    >
                        <Image
                            source={avatar}
                            style={{
                                borderRadius: 50,
                                height: 50,
                                width: 50,
                                borderWidth: 2,
                                borderColor: COLORS.background,
                            }}
                        />
                        <View
                            style={{
                                paddingVertical: 10,
                                flex: 1,
                                backgroundColor: COLORS.lightWhite,
                                borderRadius: 30,
                                borderWidth: 1,
                                borderColor: COLORS.gray,
                            }}
                        >
                            <TextInput
                                placeholder="Thêm bình luận..."
                                multiline={true}
                                placeholderTextColor={COLORS.darkText}
                                style={{
                                    backgroundColor: COLORS.lightWhite,
                                    fontFamily: FONT.regular,
                                    marginHorizontal: 15,
                                    fontSize: FONT_SIZE.small,
                                    paddingRight: 2,
                                }}
                            ></TextInput>
                        </View>
                    </View>
                </View>
            </Modal> */}
        </View>
    );
};

export default Interact;
