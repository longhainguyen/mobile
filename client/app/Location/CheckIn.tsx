import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import CheckIn from '../../compoments/Location';

const App = () => {
    return <SafeAreaView style={styles.container}>{/* <CheckIn /> */}</SafeAreaView>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
