import { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserData from '../../dataTemp/UserData';
import UserIcon from '../../compoments/UserIcon';
import PostData from '../../dataTemp/PostData';
import PostContent from '../../compoments/PostContent';
import Interact from '../../compoments/Interact';
import InfoAccount from '../../compoments/InfoAccount';

export default function Account({ navigation }: any) {
    const logout = () => {
        AsyncStorage.setItem('isLoggedIn', '');
        navigation.navigate('Login');
    };

    useEffect(() => {
        AsyncStorage.getItem('userName').then((results) => {
            console.log(results);
        });
    }, []);

    return (
        <ScrollView style={{ flex: 1, marginTop: 10, backgroundColor: COLORS.white }}>
            <InfoAccount
                isOwn={true}
                avatar={UserData[0].avatar}
                cover={UserData[0].background}
                name={UserData[0].name}
            />
            <UserIcon
                avatar={UserData[0].avatar}
                isFollowed={false}
                userName={UserData[0].name}
                isOwner={true}
                openAccount={() => {
                    navigation.navigate('Account');
                }}
            />
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('ShowPost', {
                        avatar: UserData[0].avatar,
                        isFollowed: false,
                        userName: UserData[0].name,
                        isOwner: true,
                        images: PostData[0].images,
                        time: PostData[0].time,
                        description: PostData[0].description,
                        comment: PostData[0].comments.length,
                        like: PostData[0].like,
                        share: PostData[0].share,
                    })
                }
            >
                <PostContent
                    navigation={navigation}
                    images={PostData[0].images}
                    time={PostData[0].time}
                    description={PostData[0].description}
                />
            </TouchableOpacity>
            <Interact
                comment={PostData[0].comments.length}
                like={PostData[0].like}
                share={PostData[0].share}
                avatar={UserData[0].avatar}
                atHome={true}
                openComment={() => {
                    navigation.navigate('CommentHome');
                }}
            />

            <TouchableOpacity
                style={{ marginTop: 100, padding: 30, backgroundColor: COLORS.redButton }}
                onPress={logout}
            >
                <Text>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
