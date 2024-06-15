import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import React from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { ECommentRight } from '../../enum/OptionPrivacy';

export default function OptionPrivacyIcon({
    optionPrivacyrightRef,
    status,
    IconComponent,
}: {
    optionPrivacyrightRef: React.RefObject<BottomSheet>;
    status: String;
    IconComponent: React.ReactNode;
}) {
    // const stateSelectedUser = useSelector((state: RootState) => state.selectedUserReducer);
    return (
        <TouchableOpacity
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 2,
                minWidth: 50,
                maxWidth: 80,
            }}
            onPress={() => {
                Keyboard.dismiss();
                optionPrivacyrightRef.current?.snapToIndex(0);
            }}
        >
            {IconComponent}
            <Text style={{ color: 'blue', textAlign: 'center' }}>{status}</Text>
        </TouchableOpacity>
    );
}
