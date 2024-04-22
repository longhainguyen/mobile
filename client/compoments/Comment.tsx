import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
} from 'react-native';
import { COLORS } from '../constants';
import { FONT, FONT_SIZE } from '../constants/font';
import { FlatList, ScrollView, TextInput } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { decremented, setState } from '../redux/stateComment/stateComment';
import { RootState, store } from '../redux/Store';

const { height, width } = Dimensions.get('window');

interface Props {
    title: string;
    avatar: ImageSourcePropType;
    atSinglePost?: boolean;
    dataCommentsOfPost: ItemCommentProps[];
}

type Ref = BottomSheet;

export interface ItemCommentProps {
    id: string;
    parent_id: string;
    text: string;
    avatar: any;
    name: string;
    type?: number;
    name_parent?: string;
    input_answer?: React.RefObject<TextInput>;
}

const Item = ({
    id,
    parent_id,
    text,
    avatar,
    name,
    type,
    name_parent,
    input_answer,
}: ItemCommentProps) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                paddingBottom: 10,
                marginLeft: type === 0 ? 10 : 40,
                marginTop: type === 0 ? 10 : 2,
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
                source={avatar}
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
                        {name}{' '}
                    </Text>
                    {type === 2 && (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <AntDesign
                                name="caretright"
                                size={13}
                                color="black"
                                style={{ marginBottom: 1 }}
                            />
                            <Text style={{ fontFamily: FONT.bold, fontSize: FONT_SIZE.small }}>
                                {' ' + name_parent}{' '}
                            </Text>
                        </View>
                    )}
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
                        {text}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        input_answer?.current?.focus();
                    }}
                >
                    <Text style={{ color: COLORS.gray }}>Trả lời</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const Comment = forwardRef<Ref, Props>((props, ref) => {
    const snapPoints = useMemo(() => ['50%'], []);
    const snapPointsHome = useMemo(() => ['99%'], []);
    const [listComment, setListComment] = useState<ItemCommentProps[]>([]);

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        // form object to render child
        var arr: ItemCommentProps[] = [];
        var arr2: ItemCommentProps[] = [];
        var arr3: ItemCommentProps[] = [];
        for (let item of props.dataCommentsOfPost) {
            if (item.parent_id === '0') {
                const newItem: ItemCommentProps = {
                    avatar: item.avatar,
                    id: item.id,
                    name: item.name,
                    parent_id: item.parent_id,

                    text: item.text,
                    name_parent: '',
                    type: 0,
                    input_answer: inputRef,
                };
                arr.push(newItem);
                arr2 = props.dataCommentsOfPost
                    .filter((ele) => ele.parent_id === item.id)
                    .map((filteredItem) => ({
                        text: filteredItem.text,
                        avatar: filteredItem.avatar,
                        name: filteredItem.name,
                        id: filteredItem.id,
                        parent_id: filteredItem.parent_id,

                        name_parent: item.name,
                        input_answer: inputRef,
                        type: 1,
                    }));
                if (arr2.length) {
                    for (let item2 of arr2) {
                        arr3 = props.dataCommentsOfPost
                            .filter((ele) => ele.parent_id === item2.id)
                            .map((filteredItem) => ({
                                text: filteredItem.text,
                                avatar: filteredItem.avatar,
                                name: filteredItem.name,
                                id: filteredItem.id,
                                parent_id: filteredItem.parent_id,

                                name_parent: item2.name,
                                input_answer: inputRef,
                                type: 2,
                            }));
                        if (arr3.length) {
                            arr.push({ ...item2 });
                            arr = arr.concat(arr3);
                        } else {
                            arr.push({ ...item2 });
                        }
                    }
                }
            }
        }
        setListComment(arr);
    }, [props.dataCommentsOfPost]);

    const handleSheetChanges = useCallback((index: number) => {
        if (index == -1) {
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

    return (
        <BottomSheet
            ref={ref}
            snapPoints={props.atSinglePost ? snapPoints : snapPointsHome}
            enablePanDownToClose={true}
            index={-1}
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
                Comments {listComment.length}
            </Text>

            <FlatList
                style={{ marginTop: 30, marginBottom: 70 }}
                data={listComment}
                renderItem={({ item }) => (
                    <Item
                        text={item.text}
                        name={item.name}
                        avatar={item.avatar}
                        type={item.type}
                        id={item.id}
                        parent_id={item.parent_id}
                        name_parent={item.name_parent}
                        input_answer={inputRef}
                    />
                )}
                keyExtractor={(item) => item.id}
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
                }}
            >
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

                <TextInput
                    ref={inputRef}
                    placeholder="Thêm bình luận..."
                    multiline={true}
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
                />
                <TouchableOpacity
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
            </BottomSheetView>
        </BottomSheet>
    );
});

export default Comment;
