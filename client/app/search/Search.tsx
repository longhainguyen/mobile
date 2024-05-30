import { View, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import _list_comments from '../../dataTemp/CommentData';
import SearchBarComponent from '../../compoments/SearchBar';

const { height, width } = Dimensions.get('window');

export default function Search({ navigation }: any) {
    return (
        <View style={{ flex: 1, marginTop: 15 }}>
            <SearchBarComponent />

            <View style={{ height: 50 }}></View>
        </View>
    );
}
