import { View, Text, Keyboard } from 'react-native';
import React, { forwardRef, useCallback, useMemo, useRef } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { COLORS } from '../../constants';
import OptionIcon from '../home/OptionIcon';
import { FontAwesome6 } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SimpleLineIcons } from '@expo/vector-icons';
import { ECommentRight } from '../../enum/OptionPrivacy';
import { updateCommentMode } from '../../api/commetMode.api';
import { RootState, store } from '../../redux/Store';
import { setState } from '../../redux/stateComment/stateComment';
import { useSelector } from 'react-redux';
import { IUser } from '../../type/User.type';

type Ref = BottomSheet;

interface Props {
    navigation: any;
    listUserSpecific?: IUser[];
    setStatusModeComment: React.Dispatch<React.SetStateAction<string>>;
    idPost?: string;
}

const OptionPrivacyrights = forwardRef<Ref, Props>((props, ref) => {
    const snapPoints = useMemo(() => ['30%', '50%', '90%'], []);
    const stateSelectedUser = useSelector((state: RootState) => state.selectedUserReducer);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );

    const handleClose = () => {
        if (ref && typeof ref === 'object' && 'current' in ref) {
            ref.current?.close();
        }
    };

    const handleSheetChange = useCallback((index: number) => {
        // console.log('handleSheetChange', index);
        if (index == -1) {
            Keyboard.dismiss();
        }
        store.dispatch(setState(index));
    }, []);

    const hanleChooseUser = () => {
        props.navigation.navigate('ListUser', {
            listUser: props.listUserSpecific,
        });
    };

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChange}
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: COLORS.lightWhite }}
        >
            <BottomSheetView>
                <OptionIcon
                    onPressOption={() => {
                        handleClose();
                        props.setStatusModeComment(ECommentRight.ALL);
                    }}
                    IconComponent={<FontAwesome6 name="earth-asia" size={24} color="black" />}
                    label="Tất cả mọi người"
                />
                <OptionIcon
                    onPressOption={() => {
                        handleClose();
                        props.setStatusModeComment(ECommentRight.FOLLOWER);
                    }}
                    IconComponent={<FontAwesome name="group" size={24} color="black" />}
                    label="Người theo dõi"
                />
                <OptionIcon
                    onPressOption={() => {
                        handleClose();
                        hanleChooseUser();
                        props.setStatusModeComment(ECommentRight.SPECIFIC);
                    }}
                    IconComponent={
                        <SimpleLineIcons name="user-following" size={24} color="black" />
                    }
                    label="Người chỉ định"
                />
                <OptionIcon
                    onPressOption={() => {
                        handleClose();
                        props.setStatusModeComment(ECommentRight.DISABLE);
                    }}
                    IconComponent={<FontAwesome6 name="comment-slash" size={24} color="black" />}
                    label="Tắt bình luận"
                />
            </BottomSheetView>
        </BottomSheet>
    );
});

export default OptionPrivacyrights;
