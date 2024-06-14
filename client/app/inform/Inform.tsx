import React, { useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import TodayNotificationsScreen from '../../compoments/TodayNotification';
import PreviousNotificationsScreen from '../../compoments/Previousnotification';
import DayAgoNotificationsScreen from '../../compoments/DayAgoNotification';
import ButtonBack from '../../compoments/ButtonBack';
import { INotifyItem } from '../../type/notify.type';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/Store';
import { NotificationItem } from '../../compoments/NotificationItem';
import { notifyAction, readNotification } from '../../redux/notify/notify.slice';
type Notification = {
    id: string;
    user: string;
    action: string;
    userImage: string;
    time: string;
};

const Todaynotifications: Notification[] = [
    {
        id: '1',
        user: 'iniesta',
        action: 'liked your photo',
        userImage:
            'https://th.bing.com/th/id/R.4c7c276e09b75925b377a777481fbab7?rik=rrSKPetfc3D2YQ&pid=ImgRaw&r=0',
        time: '2h',
    },

    {
        id: '2',
        user: 'nguyenhailong',
        action: 'commented: "Nice picture!"',
        userImage: 'https://randomuser.me/api/portraits/women/2.jpg',
        time: '3h',
    },
    {
        id: '3',
        user: 'Tranquymanh',
        action: 'liked your photo',
        userImage:
            'https://th.bing.com/th?id=OIP.2yzU_uQD3U15Sti83e-BTAHaEK&w=333&h=187&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
        time: '7h',
    },
];
const DayAgonotifications: Notification[] = [
    {
        id: '4',
        user: 'gâywar"',
        action: 'commented: "Kieu gi chả thua',
        userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
        time: '1 day',
    },
    {
        id: '5',
        user: 'nvmanh',
        action: 'posted a image with caption : Vitamin sea with hot summer',
        userImage:
            'https://th.bing.com/th/id/OIP.0qCxdrkydQWT6BUqT3HAgAHaE8?w=234&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        time: '1 day',
    },
    {
        id: '6',
        user: 'phamHoang',
        action: 'posted a image with caption : My idol',
        userImage: 'https://th.bing.com/th/id/OIP.ThaWcL_fEqbNccrpSIKGcgHaJN?rs=1&pid=ImgDetMain',
        time: '1 day',
    },
];
const Previousnotifications: Notification[] = [
    {
        id: '7',
        user: 'chris evan',
        action: 'followed you',
        userImage:
            'https://th.bing.com/th/id/R.ee9d73bf6777298672913b609e2e48af?rik=tAZ%2bF1nlaJp6SA&pid=ImgRaw&r=0',
        time: '2 day',
    },
];

type NotificationProps = {
    route: any;
    navigation: any;
};

const NotificationsScreen = ({ route, navigation }: NotificationProps) => {
    const notifyState = useSelector((state: RootState) => state.notifyReducer);
    const userState = useSelector((state: RootState) => state.reducerUser);
    const appDispatch: AppDispatch = useDispatch();
    const navigatePost = useCallback((postId: number, notificationId: number) => {
        appDispatch(readNotification({ notifyId: notificationId, userId: userState.id }));
        navigation.navigate('ShowPost', {
            isOwner: true,
            postId,
        });
    }, []);
    return (
        <View style={styles.container1}>
            <ButtonBack title="Thông báo" onBack={() => navigation.goBack()} />
            <View style={styles.header}>
                <Text style={styles.headerText}></Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', gap: 5 }}>
                {/* <TodayNotificationsScreen style={styles.notificationSection} />
                <DayAgoNotificationsScreen style={styles.notificationSection} />
                <PreviousNotificationsScreen style={styles.notificationSection} /> */}
                {notifyState?.data &&
                    notifyState.data.map((item, index) => (
                        <NotificationItem
                            key={index}
                            notification={item}
                            onNavigate={navigatePost}
                        />
                    ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 0,
        margin: 0,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    notificationSection: {
        margin: 0,
    },
    header: {
        marginTop: 10,
        fontWeight: 'bold',
        padding: 10,
        marginBottom: 7,
        backgroundColor: '#fff',
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginTop: 10,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    notificationText: {
        flex: 1,
    },
    username: {
        fontWeight: 'bold',
    },
    time: {
        color: '#666',
        marginTop: 5,
    },
});

export default NotificationsScreen;
