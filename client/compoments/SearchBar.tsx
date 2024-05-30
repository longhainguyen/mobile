import React, { useEffect, useState } from 'react';
import { SearchBar } from '@rneui/themed';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { searchPost, searchUser } from '../api/search.api';

type SearchBarComponentProps = {};

const searchBar: React.FunctionComponent<SearchBarComponentProps> = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);

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
                // await searchUsers();
                await searchPosts();
            } else if (search.length === 0) {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
        // searchUsers();
    }, [search]);

    return (
        <View style={styles.view}>
            <SearchBar
                lightTheme
                placeholder="Type Here..."
                onChangeText={updateSearch}
                value={search}
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
