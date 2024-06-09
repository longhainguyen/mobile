import { View, Text } from 'react-native';
import React from 'react';

export default function NoResultsScreen() {
    return (
        <View
            style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f0f0', // Màu nền sáng nhẹ
            }}
        >
            <Text
                style={{
                    fontSize: 18,
                    color: '#333', // Màu chữ xám đậm
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}
            >
                Chưa có kết quả nào
            </Text>
        </View>
    );
}
