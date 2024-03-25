import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface UserProp {
    id: number;
    username: string;
    email: string;
    avatar: string;
    background: string;
}

const User: React.FC<UserProp> = ({ id, username, email, avatar, background }) => {
    return <View></View>;
};
