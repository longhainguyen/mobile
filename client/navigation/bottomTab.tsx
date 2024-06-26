import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../app/home/Home';
import Login from '../app/authen/Login';
import Post from '../app/post/NewPost';
import Account from '../app/account/Account';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { Entypo } from '@expo/vector-icons';
import { RootStackParamList } from '.';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/Store';
import { useEffect } from 'react';
import { connectSocket, socketActions } from '../redux/socket/socket.slice';
import { fetchNotification, notifyAction } from '../redux/notify/notify.slice';
import { OnLikedPostCallBack } from '../type/notify.type';

type Props = NativeStackScreenProps<RootStackParamList, 'BottomTab', 'MyStack'>;

const Tab = createBottomTabNavigator();

const BottomTab = ({ route, navigation }: Props) => {
    const appDispatch: AppDispatch = useDispatch();
    const userState = useSelector((state: RootState) => state.reducerUser);
    const stateComment = useSelector((state: RootState) => state.reducer.index);

    const onLikedPostCb: OnLikedPostCallBack = (notification) => {
        if (notification) appDispatch(notifyAction.addNotify(notification));
    };

    const setUpSocket = async () => {
        const action = await appDispatch(connectSocket());
        appDispatch(socketActions.onJoinApp());
        appDispatch(socketActions.onLikedPost(onLikedPostCb));
    };

    const disconnectSocketHandler = () => {
        appDispatch(socketActions.offLikedPost());
        appDispatch(socketActions.disconnectSocket());
    };

    useEffect(() => {
        setUpSocket();
        return () => {
            disconnectSocketHandler();
        };
    }, []);

    useEffect(() => {
        if (userState.id) {
            appDispatch(fetchNotification(userState.id));
        }
    }, [userState.id]);

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarHideOnKeyboard: true,
                tabBarVisibilityAnimationConfig: {},
                tabBarStyle: {
                    backgroundColor: COLORS.lightWhite,
                    display: stateComment !== -1 ? 'none' : undefined,
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    elevation: 0,
                    height: 60,
                },
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Entypo
                                name="home"
                                size={24}
                                color={focused ? 'black' : COLORS.gray2}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Post"
                component={Post}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <MaterialIcons
                                name="post-add"
                                size={24}
                                color={focused ? 'black' : COLORS.gray2}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Account"
                component={Account}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <MaterialIcons
                                name="account-circle"
                                size={24}
                                color={focused ? 'black' : COLORS.gray2}
                            />
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTab;
