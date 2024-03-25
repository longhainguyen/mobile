import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import fonts from './config/font';
import Navigation from './navigation';
import { useEffect } from 'react';
import { SplashScreen } from 'expo-router';

export default function App() {
    const [fontsLoaded] = useFonts(fonts);

    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hideAsync();
        }, 900);
    }, []);

    return !fontsLoaded ? null : (
        <View style={styles.container}>
            <Navigation />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
    },
});
