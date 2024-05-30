import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
        action: 'liked your post',
        userImage:
            'https://th.bing.com/th?id=OIP.2yzU_uQD3U15Sti83e-BTAHaEK&w=333&h=187&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
        time: '7h',
    },
];

const NotificationItem = ({ item }: { item: Notification }) => {
    return (
        <View style={styles.notificationItem}>
            <Image source={{ uri: item.userImage }} style={styles.userImage} />
            <View style={styles.notificationText}>
                <Text>
                    <Text style={styles.username}>{item.user}</Text> {item.action}
                </Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
            <Icon name="heart" size={20} color="#900" />
        </View>
    );
};
type TodayNotificationProps = {
    style?: ViewStyle;
};

const TodayNotificationsScreen: React.FC<TodayNotificationProps> = ({ style }) => {
    return (
        <View style={[styles.container, style]}>
            <FlatList
                data={Todaynotifications}
                renderItem={({ item }: { item: Notification }) => <NotificationItem item={item} />}
                keyExtractor={(item: Notification, index) => index.toString()}
                ListHeaderComponent={<Text style={styles.header}>Today</Text>}
                style={styles.container}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 0,
        padding: 0,
    },
    header: {
        paddingLeft: 10,
        marginTop: 10,
        fontSize: 15,
        fontWeight: 'bold',
        paddingBottom: 5,
        backgroundColor: '#fff',
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginTop: 10,
        marginBottom: 0,
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

export default TodayNotificationsScreen;
