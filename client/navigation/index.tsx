import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Login from '../app/authen/Login';
import { COLORS } from '../constants';
import Home from '../app/home/Home';
import Register from '../app/authen/Register';
import ForgetPass from '../app/authen/FogetPass';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTab from './bottomTab';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: COLORS.background,
    },
};

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    FogetPass: undefined;
    BottomTab: undefined;
};

const NotLoggInNav = () => {
    const RootStack = createNativeStackNavigator<RootStackParamList>();
    return (
        <RootStack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,
            }}
        >
            <RootStack.Screen name="Login" component={Login} />
            <RootStack.Screen
                name="BottomTab"
                component={BottomTab}
                options={{ headerShown: false }}
            />
            <RootStack.Screen name="Register" component={Register} />
            <RootStack.Screen name="FogetPass" component={ForgetPass} />
        </RootStack.Navigator>
    );
};

const LoggedInNav = () => {
    const RootStack = createNativeStackNavigator<RootStackParamList>();
    return (
        <RootStack.Navigator
            initialRouteName="BottomTab"
            screenOptions={{
                headerShown: false,
            }}
        >
            <RootStack.Screen name="Login" component={Login} />
            <RootStack.Screen
                name="BottomTab"
                component={BottomTab}
                options={{ headerShown: false }}
            />
            <RootStack.Screen name="Register" component={Register} />
            <RootStack.Screen name="FogetPass" component={ForgetPass} />
        </RootStack.Navigator>
    );
};

export default function Navigation() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    async function getData() {
        const data = await AsyncStorage.getItem('isLoggedIn');
        console.log(data, 'at navigation/index.tsx');
        setIsLoggedIn(Boolean(data));
        console.log(isLoggedIn);
    }

    useEffect(() => {
        getData();
    }, []);
    return (
        <NavigationContainer theme={theme}>
            {isLoggedIn ? <LoggedInNav /> : <NotLoggInNav />}
        </NavigationContainer>
    );
}
