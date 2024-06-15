import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    ScrollView,
    Keyboard,
    ActivityIndicator,
    Dimensions,
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
import { MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OptionPrivacyrights from '../../compoments/post/OptionPrivacyrights';
import BottomSheet from '@gorhom/bottom-sheet';
import OptionPrivacyIcon from '../../compoments/post/OptionPrivacyIcon';
import { updateCommentMode } from '../../api/commetMode.api';
import mime from 'mime';
import { ETypeFile } from '../../enum/FIle';
import { updatePost } from '../../api/post.api';
import createTwoButtonAlert from '../../compoments/AlertComponent';
import { ECommentRight } from '../../enum/OptionPrivacy';
import { AntDesign } from '@expo/vector-icons';
import CheckIn from '../../compoments/Location';

// type RootStackParamList = {
//     EditPost: { post: IPost };
// };

// type EditPostRouteProp = RouteProp<RootStackParamList, 'EditPost'>;
const { height, width } = Dimensions.get('window');

type EditPostProps = NativeStackScreenProps<RootStackParamList, 'EditPost'>;

// type EditPostProps = {
//     route: any;
//     navigation: any;
// };

export default function EditPost({ route, navigation }: EditPostProps) {
    const [content, setContent] = useState('');
    const color = useThemeColor({}, 'primary');
    const [listItem, setListItem] = useState<ItemItemProps[]>([]);
    const [listIdImageDeleted, setListIdImageDeleted] = useState<string[]>([]);
    const [listIdVideoDeleted, setListIdVideoDeleted] = useState<string[]>([]);
    const [listItemNew, setListItemNew] = useState<ItemItemProps[]>([]);
    const stateUser = useSelector((state: RootState) => state.reducerUser);
    const optionPrivacyrightRef = useRef<BottomSheet>(null);
    const [statusModeComment, setStatusModeComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (!route.params) {
            console.log('post is undefined in edit page');
        } else {
            setContent(route.params.post.content);
            if (route.params.post.checkin) {
                setAddress(route.params.post.checkin);
            }
            console.log(route.params.post.mode, 'mode comment');
            if (route.params.post.mode) {
                setStatusModeComment(route.params.post.mode);
            }

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

    const hanleDeleteItem = (id: string, uri: string) => {
        if (mime.getType(uri) === ETypeFile.VIDEO) {
            setListIdVideoDeleted((prevArray) => [...prevArray, id]);
        } else if (mime.getType(uri) === ETypeFile.IMAGE) {
            setListIdImageDeleted((prevArray) => [...prevArray, id]);
        }

        const listImageFiltered = listItem.filter((image) => {
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
            let listImageUri: ItemItemProps[] = [];
            let id = 0;

            result.assets.map((item) => {
                id++;
                let image: ItemItemProps = {
                    uri: item.uri,
                    type: item.type || '',
                    id: id + '',
                    name: item.fileName || '',
                };
                listImageUri.push(image);
            });
            setListItemNew(listItemNew.concat(listImageUri));
            setListItem(listItem.concat(listImageUri));
        }
    };

    const handleUpdate = async () => {
        Keyboard.dismiss();
        const formData = new FormData();
        setIsLoading(true);
        formData.append('caption', content);
        formData.append(
            'deleted',
            JSON.stringify({
                images: listIdImageDeleted,
                videos: listIdVideoDeleted,
            }),
        );

        const listImageFiltered = listItem.filter((item) => {
            return item.type === 'image';
        });

        for (let i = 0; i < listImageFiltered.length; i++) {
            const newImageUri = 'file:///' + listImageFiltered[i].uri.split('file:/').join('');
            const _image = {
                uri: newImageUri,
                type: mime.getType(newImageUri),
                name: newImageUri.split('/').pop(),
            };

            formData.append('images', _image);
        }

        const listVideoFiltered = listItem.filter((item) => {
            return item.type === 'video';
        });

        for (let i = 0; i < listVideoFiltered.length; i++) {
            const newVideoUri = 'file:///' + listVideoFiltered[i].uri.split('file:/').join('');
            const _video = {
                uri: newVideoUri,
                type: mime.getType(newVideoUri),
                name: newVideoUri.split('/').pop(),
            };

            formData.append('videos', _video);
        }

        try {
            const response = await updatePost(formData, route.params?.post.id + '');
            setIsLoading(false);
            setContent('');
            setListItem([]);
            setListIdImageDeleted([]);
            setListIdVideoDeleted([]);
            setListItemNew([]);
            createTwoButtonAlert({
                title: 'Update bài viết',
                content: 'Thành công',
                // navigateToHome: () => {
                //     navigation.navigate('Home');
                // },
            });
            navigation.navigate('Home');
        } catch (error) {
            setIsLoading(false);
            createTwoButtonAlert({ title: 'Update post ', content: 'Thất bại' });
            console.log(error);
        } finally {
            setIsLoading(false);
            // setContent('');
            // setListItem([]);
            // setListIdImageDeleted([]);
            // setListIdVideoDeleted([]);
            // setListItemNew([]);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, marginTop: 15 }}>
            <ButtonBack title="Edit Post" onBack={() => navigation.goBack()} />
            <View style={{ height: 100 }}></View>
            <View
                style={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderWidth: 1,
                    borderColor: COLORS.borderColor,
                    borderRadius: 10,
                    marginHorizontal: 10,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: '#FFFFFF', // White background for modern look
                    shadowColor: '#000', // Shadow for depth
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                }}
            >
                <View
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        paddingHorizontal: 10,
                    }}
                >
                    <View style={{ height: 50 }}>
                        <CheckIn setLocationCheckin={setAddress} />
                    </View>

                    {address.length > 0 && (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Text style={{ marginTop: 4, fontSize: 14, color: '#333' }}>
                                {address}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setAddress('');
                                }}
                            >
                                <AntDesign name="delete" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <OptionPrivacyIcon
                        status={statusModeComment}
                        IconComponent={<MaterialIcons name="comment" size={24} color="black" />}
                        optionPrivacyrightRef={optionPrivacyrightRef}
                    />
                    {/* {statusModeComment === ECommentRight.SPECIFIC && route.params && (
                                <Text>{route.params.selectedUsers.length} users</Text>
                            )} */}
                </View>
            </View>
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
                <Button
                    title="Update"
                    onPress={async () => {
                        await handleUpdate();
                    }}
                />
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
                                onPress={() => hanleDeleteItem(item.id, item.uri)}
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
                            id={route.params.post.idUser}
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
            {isLoading && (
                <ActivityIndicator
                    style={{
                        position: 'absolute',
                        top: height / 2,
                        left: width / 2 - 20,
                    }}
                    size="large"
                    color="#0000ff"
                />
            )}
            <OptionPrivacyrights
                navigation={navigation}
                // idPost={route.params?.post.id + ''}
                ref={optionPrivacyrightRef}
                setStatusModeComment={setStatusModeComment}
            />
        </GestureHandlerRootView>
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
        marginTop: 15,
        backgroundColor: '#FFFFFF', // Màu nền trắng
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        minHeight: 100, // Chiều cao tối thiểu
        textAlignVertical: 'top', // Hiển thị văn bản từ trên xuống
        color: COLORS.darkText,
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
