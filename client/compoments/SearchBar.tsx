import React, { useEffect, useState } from 'react';
import { SearchBar } from '@rneui/themed';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { COLORS } from '../constants';
import { searchPost, searchUser } from '../api/search.api';
import { FONT, FONT_SIZE } from '../constants/font';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

type SearchBarComponentProps = {
    route: any;
    navigation: any;
};

const searchBar = ({ route, navigation }: SearchBarComponentProps) => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [value, setValue] = useState('');

    const updateSearch = (search: string) => {
        setSearch(search);
    };

    const searchUsers = async () => {
        try {
            const results = await searchUser({
                keyword: search,
            });
            console.log(search);
            setResults(results.data);
        } catch (error) {
            console.log(error);
        }
    };

    const searchPosts = async () => {
        try {
            const results = await searchPost('1', search, 5, 0);
            // console.log(search);
            setResults(results.data);
            console.log(results.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (search.length !== 0) {
                await searchPosts();
            } else if (search.length === 0) {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <View
            style={[
                styles.view,
                { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
            ]}
        >
            <TouchableOpacity
                onPress={() => {
                    navigation.goBack();
                }}
            >
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>

            <TextInput
                placeholderTextColor={COLORS.darkText}
                placeholder="Tìm kiếm tại đây"
                style={{
                    flex: 1,
                    height: 40,
                    margin: 12,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 20,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        margin: 10,
    },
});

export default searchBar;
