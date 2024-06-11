import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { COLORS } from '../../constants'; // Adjust the import path to your COLORS module

interface OptionIconProps {
    IconComponent: React.ReactNode;
    label: string;
    onPressOption?: () => void;
}

export default function OptionIcon({ IconComponent, label, onPressOption }: OptionIconProps) {
    return (
        <TouchableOpacity
            onPress={onPressOption}
            style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 5,
                alignItems: 'center',
                borderBottomWidth: 2,
                borderColor: COLORS.borderColor,
                paddingVertical: 10,
                marginHorizontal: 10,
            }}
        >
            {IconComponent}
            <Text>{label}</Text>
        </TouchableOpacity>
    );
}
