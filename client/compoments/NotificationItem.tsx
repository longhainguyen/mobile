import { View, Text, Image, StyleSheet } from 'react-native';
import { INotifyItem } from '../type/notify.type';
import { useMemo } from 'react';
import { ENotifyType } from '../enum/notify';

export const NotificationItem = ({ notification }: { notification: INotifyItem }) => {
    const typeNotify: string = useMemo(() => {
        let text: string = '';
        switch (notification.type) {
            case ENotifyType.LIKE:
                text = 'liked';
                break;
            case ENotifyType.COMMENT:
                text = 'commented';
                break;
            case ENotifyType.SHARE:
                text = 'shared';
                break;
            default:
                text = 'viewed';
                break;
        }
        return text;
    }, [notification]);

    return (
        <View style={styles.notificationItem}>
            <Image source={{ uri: notification.user.profile.avatar }} style={styles.userImage} />
            <View style={styles.notificationText}>
                <Text>
                    <Text style={styles.username}>{notification.user.username}</Text>{' '}
                    {`${typeNotify} your post`}
                </Text>
                <Text style={styles.time}>{new Date(notification.createdAt).toLocaleString()}</Text>
            </View>
            {/* <Icon name="heart" size={20} color="#900" /> */}
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
