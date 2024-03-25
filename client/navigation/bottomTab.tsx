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

type Props = NativeStackScreenProps<RootStackParamList, 'BottomTab', 'MyStack'>;

const Tab = createBottomTabNavigator();

const BottomTab = ({ route, navigation }: Props) => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarHideOnKeyboard: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    elevation: 0,
                    height: 50,
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
                                color={focused ? 'black' : COLORS.white}
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
                                color={focused ? 'black' : COLORS.white}
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
                                color={focused ? 'black' : COLORS.white}
                            />
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTab;
