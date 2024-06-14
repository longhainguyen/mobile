import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { INotifyItem } from '../type/notify.type';
import { useMemo } from 'react';
import { ENotifyType } from '../enum/notify';

export interface INotifyItemProps {
    notification: INotifyItem;
    onNavigate: (postId: number, notificationId: number) => void;
}

export const NotificationItem = ({ notification, onNavigate }: INotifyItemProps) => {
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
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate(notification?.postId, notification.id)}
            style={[
                styles.notificationItem,
                { backgroundColor: notification.isReaded ? '#fff' : '#f9f9f9' },
            ]}
        >
            <Image source={{ uri: notification.user.profile.avatar }} style={styles.userImage} />
            <View style={styles.notificationText}>
                <Text>
                    <Text style={styles.username}>{notification.user.username}</Text>{' '}
                    {`${typeNotify} your post`}
                </Text>
                <Text style={styles.time}>{new Date(notification.createdAt).toLocaleString()}</Text>
            </View>
            {/* <Icon name="heart" size={20} color="#900" /> */}
        </TouchableOpacity>
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
