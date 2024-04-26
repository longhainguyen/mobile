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
import ShowImage from '../compoments/ShowImage';
import ShowPost from '../app/home/ShowPost';
import { SplashScreen } from 'expo-router';
import CommentHome from '../app/home/CommentHome';
import AccountOther from '../app/account/AccountOther';
import { store } from '../redux/Store';
import { setStateUser } from '../redux/stateUser/stateUser';

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
    ShowImage: undefined;
    ShowPost: undefined;
    CommentHome: undefined;
    AccountOther: undefined;
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
            <RootStack.Screen name="ShowImage" component={ShowImage} />
            <RootStack.Screen name="ShowPost" component={ShowPost} />
            <RootStack.Screen name="CommentHome" component={CommentHome} />
            <RootStack.Screen name="AccountOther" component={AccountOther} />
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
            <RootStack.Screen
                name="BottomTab"
                component={BottomTab}
                options={{ headerShown: false }}
            />
            <RootStack.Screen name="ShowImage" component={ShowImage} />
            <RootStack.Screen name="Login" component={Login} />
            <RootStack.Screen name="Register" component={Register} />
            <RootStack.Screen name="FogetPass" component={ForgetPass} />
            <RootStack.Screen name="ShowPost" component={ShowPost} />
            <RootStack.Screen name="CommentHome" component={CommentHome} />
            <RootStack.Screen name="AccountOther" component={AccountOther} />
        </RootStack.Navigator>
    );
};

export default function Navigation() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    async function getData() {
        const userString = await AsyncStorage.getItem('User');
        if (userString) {
            const user = JSON.parse(userString);
            setIsLoggedIn(user.isLoggedIn);
            store.dispatch(setStateUser(user));
            console.log(user.isLoggedIn, 'at navigation/index.tsx');
        }
    }

    useEffect(() => {
        getData();
        setTimeout(() => {
            SplashScreen.hideAsync();
        }, 900);
    }, []);

    return (
        <NavigationContainer theme={theme}>
            {isLoggedIn ? <LoggedInNav /> : <NotLoggInNav />}
        </NavigationContainer>
    );
}
