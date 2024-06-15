import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
    Dispatch,
    SetStateAction,
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    View,
    Text,
    Image,
    ImageSourcePropType,
    Keyboard,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    KeyboardAvoidingView,
    Pressable,
    Modal,
    StyleSheet,
    Button,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants';
import { FONT, FONT_SIZE } from '../constants/font';
import { FlatList, ScrollView, TextInput } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { decremented, setState } from '../redux/stateComment/stateComment';
import { RootState, store } from '../redux/Store';
import { adjustCommentApi, getComment, postComment } from '../api/comment.api';
import UserData from '../dataTemp/UserData';
import { IComment } from '../type/Comment.type';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { IPostOfSearch } from '../type/ResultSearch.type';
import { IPost } from '../type/Post.type';
import { Entypo } from '@expo/vector-icons';
import OptionIcon from './home/OptionIcon';
import { ECommentRight } from '../enum/OptionPrivacy';

const { height, width } = Dimensions.get('window');

interface Props {
    title: string;
    avatar: any;
    userId?: number;
    postId: string;
    comment?: string;
    atSinglePost?: boolean;
    lengthComment: number;
    postOpen?: IPost;
}

type Ref = BottomSheet;

export interface ItemCommentProps extends IComment {
    input_answer?: React.RefObject<TextInput>;
}

const Item = ({
    childrens,
    content,
    createdAt,
    id,
    user,
    input_answer,
    setParentId,
    setPlaceholderInComment,
    scrollToIndex,
    postId,
}: ItemCommentProps & { setParentId: (index: number) => void } & {
    setPlaceholderInComment: (text: string) => void;
} & { scrollToIndex: (index: number) => void } & { postId: string }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [display, setDisplay] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const stateUser = useSelector((state: RootState) => state.reducerUser);
    const [commetAdjust, setCommetAdjust] = useState('');
    const [adjustDisplay, setAdjustDisplay] = useState(false);
    const [height, setHeight] = useState(40);
    const [contentComment, setContentComment] = useState('');
    const [createdAtComment, setCreatedAtCommet] = useState(createdAt);
    const MAX_HEIGHT = 80;

    useEffect(() => {
        setContentComment(content);
    }, [content]);

    const handleAnswer = () => {
        if (input_answer?.current) {
            input_answer?.current?.focus();
            setParentId(id);
            // scrollToIndex(id);
            setPlaceholderInComment(user.username);
        }
    };

    const scrollToIndexInChildren = (id: number, listComment: ItemCommentProps[]) => {
        if (listComment) {
            const index = listComment.findIndex((comment) => comment.id === id);
            if (index !== -1) {
                flatListRef.current?.scrollToIndex({ index, animated: true });
            }
        }
    };

    const handleAdjustComment = async (newContent: string) => {
        try {
            const response = await adjustCommentApi(
                postId,
                newContent,
                parseInt(user.id),
                parseInt(id + ''),
            );
            // console.log(response.data);
            setContentComment(response.data.content);
            setCreatedAtCommet(response.data.createdAt);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    paddingHorizontal: 10,
                    paddingBottom: 10,
                    marginLeft: 10,
                    marginTop: 10,
                }}
            >
                <Image
                    style={{
                        borderRadius: 50,
                        height: 35,
                        width: 35,
                        borderWidth: 2,
                        borderColor: COLORS.background,
                    }}
                    source={{ uri: user.profile.avatar }}
                />

                <View
                    style={{
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        marginLeft: 5,
                        width: '88%',
                    }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontFamily: FONT.bold, fontSize: FONT_SIZE.small }}>
                            {user.username}{' '}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            flexShrink: 1,
                            maxWidth: width / 1.19,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: FONT.regular,
                                fontSize: FONT_SIZE.small,
                            }}
                        >
                            {contentComment}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 15 }}>
                        <View>
                            <Text style={{ color: COLORS.gray }}>
                                {moment(createdAtComment).startOf('minutes').fromNow()}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                handleAnswer();
                            }}
                        >
                            <Text style={{ color: COLORS.gray }}>Trả lời</Text>
                        </TouchableOpacity>
                    </View>

                    {childrens && childrens.length > 0 && (
                        <>
                            {display === true ? (
                                <FlatList
                                    ref={flatListRef}
                                    data={childrens}
                                    renderItem={({ item }: { item: ItemCommentProps }) => (
                                        <Item
                                            postId={postId}
                                            scrollToIndex={() => {
                                                // console.log(item.id);
                                                scrollToIndexInChildren(item.id, childrens);
                                                // scrollToIndex(item.id);
                                            }}
                                            setPlaceholderInComment={setPlaceholderInComment}
                                            childrens={item.childrens}
                                            content={item.content}
                                            createdAt={item.createdAt}
                                            id={item.id}
                                            user={item.user}
                                            input_answer={input_answer}
                                            setParentId={setParentId}
                                        />
                                    )}
                                ></FlatList>
                            ) : (
                                <TouchableOpacity
                                    style={{}}
                                    onPress={() => {
                                        setDisplay(true);
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: FONT.bold,
                                            fontSize: FONT_SIZE.small,
                                            color: COLORS.darkText,
                                        }}
                                    >
                                        Xem thêm {childrens.length} câu trả lời ...
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>
            </View>

            <TouchableOpacity
                style={{ position: 'absolute', right: 10, top: 15, padding: 10 }}
                onPress={() => {
                    setCommetAdjust(content);
                    setModalVisible(!modalVisible);
                }}
            >
                <Entypo name="dots-three-vertical" size={15} color="black" />
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {stateUser.id + '' === user.id + '' ? (
                            <>
                                <OptionIcon
                                    IconComponent={
                                        <AntDesign name="edit" size={24} color="black" />
                                    }
                                    label="Chỉnh sửa"
                                    onPressOption={() => {
                                        setAdjustDisplay(!adjustDisplay);
                                    }}
                                />
                                {adjustDisplay && (
                                    <>
                                        <TextInput
                                            multiline={true}
                                            numberOfLines={4}
                                            onContentSizeChange={(event) => {
                                                setHeight(event.nativeEvent.contentSize.height);
                                            }}
                                            value={commetAdjust}
                                            onChangeText={setCommetAdjust}
                                            style={{
                                                height: Math.min(MAX_HEIGHT, Math.max(40, height)),
                                                margin: 12,
                                                borderWidth: 1,
                                                padding: 10,
                                                borderRadius: 10,
                                            }}
                                        ></TextInput>
                                        <View
                                            style={{
                                                marginHorizontal: 12,
                                            }}
                                        >
                                            <Button
                                                color="#f194ff"
                                                title="Summit"
                                                onPress={async () => {
                                                    try {
                                                        await handleAdjustComment(commetAdjust);
                                                        setAdjustDisplay(false);
                                                        Alert.alert('Success');
                                                    } catch (error) {
                                                        Alert.alert('Fail');
                                                    }
                                                }}
                                            />
                                        </View>
                                    </>
                                )}
                            </>
                        ) : (
                            <OptionIcon
                                IconComponent={<AntDesign name="flag" size={24} color="black" />}
                                label="Báo cáo"
                                onPressOption={() => {}}
                            />
                        )}

                        <AntDesign
                            name="close"
                            size={24}
                            color="black"
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                setAdjustDisplay(false);
                            }}
                            style={styles.closeIcon}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const Comment = forwardRef<Ref, Props>((props, ref) => {
    const stateUser = useSelector((state: RootState) => state.reducerUser);
    const snapPoints = useMemo(() => ['50%'], []);
    const snapPointsHome = useMemo(() => ['80%'], []);
    const [listComment, setListComment] = useState<IComment[]>([]);
    const [listCommentDisplay, setListCommentDisplay] = useState<IComment[]>([]);
    const [text, onChangeText] = useState('');
    const [parentId, setParentId] = useState(0);
    const stateComment = useSelector((state: RootState) => state.reducer.index);
    const flatListRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);
    const [placeholderInComment, setPlaceholderInComment] = useState('');
    const [lengthComment, setLengthComment] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const LIMIT = 5;
    const [initialLoading, setInitialLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // useEffect(() => {
    //     setLengthComment(props.lengthComment);
    // }, [listComment]);

    const [isPublicUser, setIsPublicUser] = useState(false);
    // useEffect(() => {
    //     if (props.postOpen?.publicUsers) {
    //         console.log('check here');

    //         props.postOpen.publicUsers.map((user) => {
    //             if (user.id + '' === stateUser.id) {
    //                 setIsPublicUser(true);
    //             }
    //         });
    //     }
    // }, []);

    const clearState = () => {
        console.log('clear state at comment');
        setListComment([]);
        setLengthComment(0);
        setPage(1);
        onChangeText('');
        setParentId(0);
        setPlaceholderInComment('');
        setHasMore(true);
        setIsLoading(false);
        setIsPublicUser(false);
        setOpen(false);
    };

    const handleGetComment = async (page: number) => {
        if (isLoading || !hasMore) {
            console.log('Not load comment');

            return;
        }

        setIsLoading(true);
        try {
            if (props.postId.length > 0) {
                const resposne = await getComment(props.postId, LIMIT, page);
                if (resposne.data.length > 0) {
                    setListComment((prevComments) => [...prevComments, ...resposne.data]);
                    setPage(page + 1);
                } else {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMore = async () => {
        if (!isLoading && hasMore) {
            await handleGetComment(page);
        }
    };

    const renderFooter = () => {
        if (!isLoading) return null;
        return <ActivityIndicator size="large" color="#0000ff" />;
    };

    useEffect(() => {
        if (stateComment === 0 && props.postId.length > 0 && open === true) {
            handleGetComment(0);
            setLengthComment(props.lengthComment);
            console.log('load comment lan dau');
            if (props.postOpen?.publicUsers) {
                console.log('check here');
                props.postOpen.publicUsers.map((user) => {
                    if (user.id + '' === stateUser.id) {
                        setIsPublicUser(true);
                    }
                });
            }
        } else if (stateComment === -1) {
            clearState();
        }
    }, [stateComment]);

    const handlePostComment = async () => {
        try {
            const response = await postComment({
                content: text,
                parentId: parentId,
                postId: props.postId || '',
                userId: props.userId || -1,
            });

            const newComment: IComment = {
                childrens: [],
                content: response.content,
                createdAt: response.createdAt,
                id: response.id,
                user: stateUser,
            };

            if (parentId === 0) {
                setListComment([newComment].concat(listComment));
            } else {
                listComment.map((comment) => {
                    if (comment.id === parentId) {
                        comment.childrens.push(newComment);
                    }
                });
            }

            Keyboard.dismiss();
            onChangeText('');
        } catch (error) {
            console.log(error);
        }
    };

    const handleSheetChanges = useCallback((index: number) => {
        if (index == -1) {
            clearState();
            Keyboard.dismiss();
        } else {
            setOpen(true);
        }
        store.dispatch(setState(index));
    }, []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );

    const scrollToIndex = (id: number) => {
        const index = listComment.findIndex((comment) => comment.id === id);
        if (index !== -1) {
            flatListRef.current?.scrollToIndex({ index, animated: true });
        }
    };

    return (
        <BottomSheet
            ref={ref}
            snapPoints={props.atSinglePost ? snapPoints : snapPointsHome}
            enablePanDownToClose={true}
            index={-1}
            style={{ zIndex: 1000 }}
            backdropComponent={renderBackdrop}
            onChange={handleSheetChanges}
            backgroundStyle={{ backgroundColor: COLORS.lightWhite }}
            handleHeight={props.atSinglePost ? 40 : 80}
        >
            <Text
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontFamily: FONT.regular,
                    fontSize: FONT_SIZE.small,
                    borderBottomWidth: 2,
                    borderBottomColor: COLORS.borderColor,
                    marginHorizontal: 10,
                    backgroundColor: COLORS.white,
                }}
            >
                Comments {lengthComment}
            </Text>

            <FlatList
                ref={flatListRef}
                style={{ marginTop: 30, marginBottom: 70 }}
                data={listComment}
                renderItem={({ item }: { item: IComment }) => (
                    <Pressable>
                        <Item
                            postId={props.postId}
                            scrollToIndex={scrollToIndex}
                            setPlaceholderInComment={setPlaceholderInComment}
                            setParentId={setParentId}
                            childrens={item.childrens}
                            content={item.content}
                            createdAt={item.createdAt}
                            id={item.id}
                            user={item.user}
                            input_answer={inputRef}
                        />
                    </Pressable>
                )}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
            ></FlatList>

            <BottomSheetView
                style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    bottom: 0,
                    paddingVertical: 5,
                    backgroundColor: COLORS.white,
                    borderRadius: 50,
                    borderColor: COLORS.borderColor,
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: placeholderInComment.length > 0 ? 25 : 0,
                }}
            >
                {placeholderInComment.length > 0 && (
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 4,
                            top: 0,
                            left: width / 6,
                        }}
                        onPress={() => {
                            setPlaceholderInComment('');
                            onChangeText('');
                            setParentId(0);
                        }}
                    >
                        <Text style={{ fontFamily: FONT.regular, fontSize: FONT_SIZE.small }}>
                            Trả lời {placeholderInComment}
                        </Text>
                        <MaterialIcons name="cancel" size={24} color="black" />
                    </TouchableOpacity>
                )}

                <>
                    <Image
                        source={props.avatar}
                        style={{
                            borderRadius: 50,
                            height: 50,
                            width: 50,
                            borderWidth: 2,
                            borderColor: COLORS.background,
                            marginBottom: 10,
                            marginLeft: 10,
                        }}
                    />

                    {(props.postOpen?.mode === ECommentRight.DISABLE &&
                        props.postOpen.idUser + '' !== stateUser.id) ||
                    (props.postOpen?.mode !== ECommentRight.ALL &&
                        isPublicUser === false &&
                        props.postOpen?.idUser + '' !== stateUser.id) ? (
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    marginLeft: 30,
                                    fontFamily: FONT.regular,
                                    fontSize: FONT_SIZE.small,
                                }}
                            >
                                Bạn không có quyền bình luận
                            </Text>
                        </View>
                    ) : (
                        <>
                            <>
                                <TextInput
                                    ref={inputRef}
                                    placeholder="Thêm bình luận..."
                                    multiline={true}
                                    value={text}
                                    onChangeText={onChangeText}
                                    placeholderTextColor={COLORS.darkText}
                                    style={{
                                        borderRadius: 30,
                                        fontSize: FONT_SIZE.small,
                                        lineHeight: 20,
                                        padding: 8,
                                        flex: 1,
                                        backgroundColor: 'rgba(151, 151, 151, 0.25)',
                                        fontFamily: FONT.regular,
                                        marginBottom: 10,
                                        marginRight: 10,
                                    }}
                                ></TextInput>
                                <TouchableOpacity
                                    onPress={handlePostComment}
                                    style={{
                                        backgroundColor: COLORS.gray,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 5,
                                        marginBottom: 10,
                                        borderRadius: 50,
                                        width: 35,
                                        height: 35,
                                    }}
                                >
                                    <AntDesign name="arrowup" size={24} color="black" />
                                </TouchableOpacity>
                            </>
                        </>
                    )}
                </>
            </BottomSheetView>
        </BottomSheet>
    );
});

export default Comment;

const openComment = async (
    index: number,
    post_id: string,
    avatarUserOwn: any,
    bottemSheetInstance: BottomSheet | null,
) => {
    bottemSheetInstance?.snapToIndex(index);

    // setAvartarUserOwnPost(avatarUserOwn);
    // setPostIdOpen(post_id);
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        position: 'absolute',
        top: height / 2 - 150,
        left: width / 2 - 150,
        width: 300,
        height: 200,
        backgroundColor: '#fff', // Màu trắng hiện đại
        borderColor: '#ccc', // Màu viền xám nhạt
        borderWidth: 2,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        padding: 20,
        justifyContent: 'center',
        gap: 2,
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    optionLabel: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'serif', // Sử dụng phông chữ cổ điển
        marginTop: 10,
    },
});

export { openComment };
