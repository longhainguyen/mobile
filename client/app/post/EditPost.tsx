import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    ScrollView,
} from 'react-native';
import ButtonBack from '../../compoments/ButtonBack';
import { COLORS } from '../../constants';
import { Button, Card, useThemeColor } from '../../compoments/Themed';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { IFile, IImage, IPost, IVideo, ItemItemProps } from '../../type/Post.type';
import { RouteProp } from '@react-navigation/native';
import UserIcon from '../../compoments/UserIcon';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import PostContent from '../../compoments/PostContent';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

// type RootStackParamList = {
//     EditPost: { post: IPost };
// };

// type EditPostRouteProp = RouteProp<RootStackParamList, 'EditPost'>;

type EditPostProps = NativeStackScreenProps<RootStackParamList, 'EditPost'>;

// type EditPostProps = {
//     route: any;
//     navigation: any;
// };

export default function EditPost({ route, navigation }: EditPostProps) {
    const [content, setContent] = useState('');
    const color = useThemeColor({}, 'primary');
    const [listItem, setListItem] = useState<ItemItemProps[]>([]);
    const stateUser = useSelector((state: RootState) => state.reducerUser);

    useEffect(() => {
        if (!route.params) {
            console.log('post is undefined in edit page');
        } else {
            setContent(route.params.post.content);
            const itemListOfPost: IFile[] = route.params.post.videos.concat(
                route.params.post.images,
            );
            var _itemList: ItemItemProps[] = [];
            itemListOfPost.map((item: IFile) => {
                _itemList.push({
                    id: item.id,
                    uri: item.url,
                });
            });

            setListItem(_itemList);
            console.log(_itemList, 'image at edit');
        }
    }, []);

    const hanleDeleteItem = (id: string) => {
        var listImageFiltered = listItem.filter((image) => {
            if (image.id !== id) {
                return image;
            }
        });

        setListItem(listImageFiltered);
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
            allowsMultipleSelection: true,
            base64: true,
            videoQuality: 1,
        });
        if (!result.canceled) {
            var listImageUri: ItemItemProps[] = [];
            var id = 0;

            result.assets.map((item) => {
                id++;
                var image: ItemItemProps = {
                    uri: item.uri,
                    type: item.type || '',
                    id: id + '',
                    name: item.fileName || '',
                };
                listImageUri.push(image);
            });
            setListItem(listItem.concat(listImageUri));
        }
    };
    return (
        <View style={{ flex: 1, marginTop: 15 }}>
            <ButtonBack title="Edit Post" onBack={() => navigation.goBack()} />
            <View style={{ height: 100 }}></View>
            <TextInput
                placeholder="What do you think"
                value={content}
                onChangeText={setContent}
                style={[styles.textInput, { marginHorizontal: 10 }]}
                multiline={true}
                placeholderTextColor={COLORS.darkText}
            />

            <Card style={[styles.row]}>
                <TouchableOpacity onPress={handlePickImage}>
                    <Feather name="image" size={24} color={color} />
                </TouchableOpacity>
                <Button title="Update" />
            </Card>
            {listItem.length > 0 && (
                <FlatList
                    horizontal={true}
                    data={listItem}
                    renderItem={({ item }) => (
                        <ImageBackground
                            source={{ uri: item.uri }}
                            style={[
                                styles.image,
                                {
                                    marginLeft: 10,
                                    borderColor: COLORS.gray,
                                    borderWidth: 1,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.imageButton}
                                onPress={() => hanleDeleteItem(item.id)}
                            >
                                <Feather name="x" size={16} color="black" />
                            </TouchableOpacity>
                        </ImageBackground>
                    )}
                    keyExtractor={(item) => item.id}
                />
            )}

            <ScrollView>
                {route.params && route.params.post.origin && (
                    <View
                        style={{
                            padding: 10,
                            marginHorizontal: 10,
                            marginVertical: 10,
                            borderWidth: 2,
                            borderColor: COLORS.borderColor,
                            borderRadius: 30,
                        }}
                    >
                        <UserIcon
                            avatar={{ uri: route.params.post.origin.user.profile.avatar }}
                            width={30}
                            height={30}
                            threeDotsDisplay={false}
                            isFollowed={route.params.post.isFollowed || false}
                            userName={route.params.post.origin.user.username}
                            isOwner={stateUser.id === route.params.post.idUser ? true : false}
                            openAccount={() => {
                                if (route.params) {
                                    if (stateUser.id === route.params.post.idUser) {
                                        route.params.navigation.navigate('Account');
                                    } else {
                                        route.params.navigation.navigate('AccountOther', {
                                            avatar: route.params.post.avartar,
                                            isFollowed: false,
                                            isOwner: false,
                                            userName: route.params.post.userName,
                                            idUser: route.params.post.idUser,
                                        });
                                    }
                                }
                            }}
                        />
                        <TouchableOpacity
                            onPress={() =>
                                route.params &&
                                route.params.navigation.navigate('ShowPost', {
                                    avatar: route.params.post.origin?.user.profile.avatar,
                                    isFollowed: route.params.post.isFollowed,
                                    userName: route.params.post.origin?.user.username,
                                    isOwner:
                                        route.params.post.origin?.user.id + '' === stateUser.id
                                            ? true
                                            : false,
                                    images: route.params.post.origin?.images,
                                    time: route.params.post.origin?.createdAt,
                                    description: route.params.post.origin?.caption,
                                    comment: route.params.post.comments,
                                    like: route.params.post.likes,
                                    share: route.params.post.shares,
                                    postId: route.params.post.id,
                                    videos: route.params.post.videos,
                                })
                            }
                        >
                            <PostContent
                                videos={route.params.post.origin.videos}
                                navigation={navigation}
                                images={route.params.post.origin.images}
                                time={route.params.post.origin.createdAt}
                                description={route.params.post.origin.caption}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 8,
        marginHorizontal: 10,
    },
    textInput: {
        fontSize: 18,
        color: COLORS.black,
        marginTop: 8,
        marginLeft: 8,
    },
    image: {
        height: 100,
        width: 100,
        alignItems: 'flex-start',
        padding: 8,
    },
    imageButton: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 2,
        borderColor: 'black',
        borderWidth: 2,
    },
});
