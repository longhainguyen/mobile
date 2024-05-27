import { View, Text } from 'react-native';
import React from 'react';
import ButtonBack from '../../compoments/ButtonBack';
import { IUser } from '../../type/User.type';
import { RouteProp } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

// type RootStackParamList = {
//     UpdatePost: {
//         user: IUser;
//     };
// };

type EditUserRouteProp = NativeStackScreenProps<RootStackParamList, 'UpdateAccount'>;

type UpdateAccountProps = NativeStackScreenProps<RootStackParamList, 'UpdateAccount'>;

// type UpdateAccountProps = {
//     route: EditUserRouteProp;
//     navigation: any;
// };

export default function UpdateAccount({ navigation, route }: UpdateAccountProps) {
    return (
        <View>
            <ButtonBack title="Update Account" onBack={() => navigation.goBack()} />
            <View style={{ height: 60 }}></View>
            <Text>UpdateAccount</Text>
        </View>
    );
}
