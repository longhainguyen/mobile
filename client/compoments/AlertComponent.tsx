import { Alert } from 'react-native';

interface createTwoButtonAlertProps {
    title: string;
    content: string;
    navigateToHome?: () => void;
}

const createTwoButtonAlert = ({ title, content, navigateToHome }: createTwoButtonAlertProps) => {
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
