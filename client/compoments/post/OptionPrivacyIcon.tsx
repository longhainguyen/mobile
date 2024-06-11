import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

export default function OptionPrivacyIcon({
    optionPrivacyrightRef,
    status,
    IconComponent,
}: {
    optionPrivacyrightRef: React.RefObject<BottomSheet>;
    status: String;
    IconComponent: React.ReactNode;
}) {
    return (
        <TouchableOpacity
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                height: 50,
                width: 100,
            }}
            onPress={() => {
                optionPrivacyrightRef.current?.snapToIndex(0);
            }}
        >
            {IconComponent}
            <Text>{status}</Text>
        </TouchableOpacity>
    );
}
