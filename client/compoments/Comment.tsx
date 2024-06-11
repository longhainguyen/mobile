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
} from 'react-native';
import { COLORS } from '../constants';
import { FONT, FONT_SIZE } from '../constants/font';
import { FlatList, ScrollView, TextInput } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { decremented, setState } from '../redux/stateComment/stateComment';
import { RootState, store } from '../redux/Store';
import { getComment, postComment } from '../api/comment.api';
import UserData from '../dataTemp/UserData';
import { IComment } from '../type/Comment.type';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { IPostOfSearch } from '../type/ResultSearch.type';
import { IPost } from '../type/Post.type';

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
}: ItemCommentProps & { setParentId: (index: number) => void } & {
    setPlaceholderInComment: (text: string) => void;
} & { scrollToIndex: (index: number) => void }) => {
    const [display, setDisplay] = useState(false);
    const flatListRef = useRef<FlatList>(null);

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

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
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
                        {content}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 15 }}>
                    <View>
                        <Text style={{ color: COLORS.gray }}>
                            {moment(createdAt).startOf('minutes').fromNow()}
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
    );
};
const Comment = forwardRef<Ref, Props>((props, ref) => {
    const stateUser = useSelector((state: RootState) => state.reducerUser);
    const snapPoints = useMemo(() => ['50%'], []);
    const snapPointsHome = useMemo(() => ['80%'], []);
    const [listComment, setListComment] = useState<IComment[]>([]);
    const [text, onChangeText] = useState('');
    const [parentId, setParentId] = useState(0);
    const stateComment = useSelector((state: RootState) => state.reducer.index);
    const flatListRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);
    const [answerTo, setAnswerTo] = useState('');
    const [placeholderInComment, setPlaceholderInComment] = useState('');

    const clearState = () => {
        setListComment([]);
        onChangeText('');
        setParentId(0);
        setPlaceholderInComment('');
    };

    const handleGetComment = async () => {
        try {
            const resposne = await getComment(props.postId, 10, 0);
            setListComment(resposne.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetComment();
    }, [stateComment]);

    const handlePostComment = async () => {
        const response = await postComment({
            content: text,
            parentId: parentId,
            postId: props.postId || '',
            userId: props.userId || -1,
        });
        console.log(response);
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
    };

    const handleSheetChanges = useCallback((index: number) => {
        if (index == -1) {
            clearState();
            Keyboard.dismiss();
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
                Comments {props.lengthComment}
            </Text>

            <FlatList
                ref={flatListRef}
                style={{ marginTop: 30, marginBottom: 70 }}
                data={listComment}
                renderItem={({ item }: { item: IComment }) => (
                    <Pressable>
                        <Item
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

                    {props.postOpen?.isPublic === false && props.userId + '' !== stateUser.id ? (
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

export { openComment };
