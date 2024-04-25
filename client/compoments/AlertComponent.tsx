import { Alert } from 'react-native';

const createTwoButtonAlert = (title: string, content: string) => {
    Alert.alert(
        title,
        content,
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK' },
        ],
        { cancelable: false }, // Ngăn người dùng nhấn nút ngoài ra để đóng cửa sổ
    );
};

export default createTwoButtonAlert;
