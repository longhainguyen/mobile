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
const Previousnotifications: Notification[] = [
    {
        id: '7',
        user: 'chris evan',
        action: 'is following you',
        userImage:
            'https://th.bing.com/th/id/R.ee9d73bf6777298672913b609e2e48af?rik=tAZ%2bF1nlaJp6SA&pid=ImgRaw&r=0',
        time: '2 day',
    },
    {
        id: '7',
        user: 'cậu bé ngầu',
        action: 'shared your post',
        userImage:
            'https://th.bing.com/th/id/R.6df31d90caab5a4e014f0ca46e7fce3e?rik=8cpyEq7tjjVGrw&pid=ImgRaw&r=0',
        time: '5 day',
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
type PreviousNotificationsScreenProps = {
    style?: ViewStyle;
};

const PreviousNotificationsScreen: React.FC<PreviousNotificationsScreenProps> = ({ style }) => {
    return (
        <FlatList
            data={Previousnotifications}
            renderItem={({ item }: { item: Notification }) => <NotificationItem item={item} />}
            keyExtractor={(item: Notification, index) => index.toString()}
            ListHeaderComponent={<Text style={styles.header}>Previous</Text>}
            style={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        margin: 0,
        padding: 0,
    },
    header: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingBottom: 10,
        marginBottom: 7,
        backgroundColor: '#fff',
        paddingLeft: 10,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
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

export default PreviousNotificationsScreen;
