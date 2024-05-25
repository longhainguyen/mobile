import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { COLORS } from '../../constants';
import { Keyboard, TouchableOpacity, View, Text, Alert } from 'react-native';
import { setState } from '../../redux/stateComment/stateComment';
import { store } from '../../redux/Store';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import OptionIcon from './OptionIcon';
import { IPost } from '../../type/Post.type';
import { deletePost } from '../../api/post.api';
import createTwoButtonAlert from '../AlertComponent';

interface Props {
    idUser: string;
    idUserOfPost: string;
    navigation?: any;
    post?: IPost;
}

type Ref = BottomSheet;

const Option = forwardRef<Ref, Props>((props, ref) => {
    const snapPoints = useMemo(() => ['40%'], []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );

    const handleSheetChanges = useCallback((index: number) => {
        if (index == -1) {
            Keyboard.dismiss();
        }
        store.dispatch(setState(index));
    }, []);

    const handleEdit = () => {
        if (ref && typeof ref === 'object' && 'current' in ref) {
            ref.current?.close();

            props.navigation.navigate('EditPost', {
                post: props.post,
            });
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this post?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Deletion cancelled'),
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            if (props.post?.id && props.idUser) {
                                const response = await deletePost(
                                    {
                                        userId: parseInt(props.idUser),
                                    },
                                    props.post?.id,
                                );

                                createTwoButtonAlert({ content: 'Success', title: 'Deletion' });
                            }
                        } catch (error) {
                            createTwoButtonAlert({ content: 'Error', title: 'Deletion' });
                        } finally {
                            if (ref && typeof ref === 'object' && 'current' in ref) {
                                ref.current?.close();
                            }
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true },
        );
    };

    return (
        <BottomSheet
            ref={ref}
            enablePanDownToClose={true}
            index={-1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: COLORS.lightWhite }}
            onChange={handleSheetChanges}
        >
            <BottomSheetView>
                {props.idUser === props.idUserOfPost ? (
                    <View>
                        <OptionIcon
                            onPressOption={() => {
                                handleDelete();
                            }}
                            IconComponent={<AntDesign name="delete" size={24} color="black" />}
                            label="Delete"
                        />
                        <OptionIcon
                            onPressOption={() => {
                                handleEdit();
                            }}
                            IconComponent={<AntDesign name="edit" size={24} color="black" />}
                            label="Edit"
                        />
                    </View>
                ) : (
                    <View>
                        <OptionIcon
                            IconComponent={<Feather name="flag" size={24} color="black" />}
                            label="Báo cáo"
                        />
                    </View>
                )}
            </BottomSheetView>
        </BottomSheet>
    );
});

export default Option;
