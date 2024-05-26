import React, { useCallback, useRef, useMemo, forwardRef, useState } from 'react';
import { StyleSheet, View, Text, Button, Keyboard, Image, TextInput } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { COLORS } from '../../constants';
import { store } from '../../redux/Store';
import { setState } from '../../redux/stateComment/stateComment';
import UserIcon from '../UserIcon';
import { sharePost } from '../../api/share.api';
import createTwoButtonAlert from '../AlertComponent';

interface Props {
    idUser: string;
    avatar: string;
    height: number;
    width: number;
    userName: string;
    navigation?: any;
    originId: number;
}
type Ref = BottomSheet;

const ShareView = forwardRef<Ref, Props>((props, ref) => {
    const [text, onChangeText] = useState('');
    // variables
    const snapPoints = useMemo(() => ['50%', '90%'], []);

    // callbacks
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

    const handleClosePress = useCallback(() => {}, []);
    const handleSharePost = async () => {
        try {
            const response = await sharePost(
                {
                    caption: text,
                    originId: props.originId + '',
                },
                props.idUser,
            );

            if (ref && typeof ref === 'object' && 'current' in ref) {
                ref.current?.close(); // Close the BottomSheet upon successful share
            }
            onChangeText('');

            createTwoButtonAlert({ title: 'Share', content: 'Susucess' });
        } catch (error) {
            createTwoButtonAlert({ title: 'Share', content: 'Error' });
            onChangeText('');
        } finally {
            onChangeText('');
        }
    };

    // render
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
                <UserIcon
                    avatar={{ uri: props.avatar }}
                    isFollowed={false}
                    height={35}
                    width={35}
                    isOwner={true}
                    openAccount={() => {
                        console.log('dick press');
                    }}
                    threeDotsDisplay={false}
                    userName={props.userName}
                />

                <TextInput
                    multiline
                    textAlignVertical="top"
                    onChangeText={onChangeText}
                    placeholder="Hãy viết gì đó 🔥"
                    style={{ height: 40, margin: 12, borderWidth: 1, padding: 10, minHeight: 100 }}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginHorizontal: 10,
                    }}
                >
                    <Button
                        title="Share"
                        onPress={() => {
                            handleSharePost();
                        }}
                    />
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
});

export default ShareView;
