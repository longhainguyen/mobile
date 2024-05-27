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
const DayAgonotifications: Notification[]=[
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
      action: 'posted a image with caption : Vitamin sea with hot summer.\nXuan Thanh beach is amazing',
      userImage: 'https://th.bing.com/th/id/OIP.0qCxdrkydQWT6BUqT3HAgAHaE8?w=234&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
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

const DayAgoNotificationsScreen : React.FC<TodayNotificationProps> = ({ style })=> {
return (
     <View style={[styles.container, style]}>
  <FlatList
    data={DayAgonotifications}
    renderItem={({ item }: { item: Notification }) => <NotificationItem item={item} />}
    keyExtractor={(item: Notification) => item.id}
    ListHeaderComponent={<Text style={styles.header}>A day a go</Text>}
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
  fontSize: 15,
  fontWeight: 'bold',
  paddingBottom: 7,
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

export default DayAgoNotificationsScreen;