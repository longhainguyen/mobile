import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import fonts from './config/font';
import Navigation from './navigation';
import { useEffect } from 'react';
import { SplashScreen } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from './redux/Store';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function App() {
    LogBox.ignoreAllLogs();
    const [fontsLoaded] = useFonts(fonts);

    return !fontsLoaded ? null : (
        <Provider store={store}>
            <View style={styles.container}>
                <Navigation />
                <StatusBar style="auto" />
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
    },
});
