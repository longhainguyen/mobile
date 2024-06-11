import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IHistorySearchItem } from '../../type/historySearch.type';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistorySearch() {
    const [listHistorySearch, setListHistorySearch] = useState<IHistorySearchItem[]>();

    const handleGetListHistorySearch = async () => {
        const listHistorySearchString = await AsyncStorage.getItem('HistorySearch');
        if (listHistorySearchString) {
            const listHistorySearch = JSON.parse(listHistorySearchString);
            // console.log(listHistorySearch);
            setListHistorySearch([listHistorySearch]);
        }
    };

    useEffect(() => {
        handleGetListHistorySearch();
    }, []);

    return (
        <View>
            <Text>HistorySearch</Text>
        </View>
    );
}
