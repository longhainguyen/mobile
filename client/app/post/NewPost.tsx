import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Image,
    Text,
    ImageBackground,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
    FlatList,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native';
import { Button, Card, useThemeColor } from '../../compoments/Themed';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../constants';
import { FONT, FONT_SIZE } from '../../constants/font';
import createTwoButtonAlert from '../../compoments/AlertComponent';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { IImage, IPost, IVideo, ItemItemProps } from '../../type/Post.type';
import request from '../../config/request';
import mime from 'mime';
import OptionPrivacyIcon from '../../compoments/post/OptionPrivacyIcon';
import OptionPrivacyrights from '../../compoments/post/OptionPrivacyrights';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { ECommentRight } from '../../enum/OptionPrivacy';
import { IUser } from '../../type/User.type';

const { height, width } = Dimensions.get('window');

export default function Post({ route, navigation }: any) {
    const [content, setContent] = useState('');
    const color = useThemeColor({}, 'primary');
    const stateUser = useSelector((state: RootState) => state.reducerUser);
    const [isLoading, setIsLoading] = useState(false);
    const [listItem, setListItem] = useState<ItemItemProps[]>([]);
    const optionPrivacyrightRef = useRef<BottomSheet>(null);
    const [statusModeComment, setStatusModeComment] = useState('all');
    // const { selectedUsers } = route.params;

    const handleSubmit = async () => {
        Keyboard.dismiss();
        const formData = new FormData();
        setIsLoading(true);

        if (statusModeComment === ECommentRight.SPECIFIC) {
            if (route.params) {
                const { selectedUsers }: { selectedUsers: IUser[] } = route.params;
                const selectedUserIds = selectedUsers.map((user) => user.id);
                formData.append(
                    'commentMode',
                    JSON.stringify({ mode: statusModeComment, visibleUsers: selectedUserIds }),
                );
            }
        } else {
            formData.append('commentMode', JSON.stringify({ mode: statusModeComment }));
        }

        if (listItem.length == 0 && content === '') {
            createTwoButtonAlert({ title: 'Tạo post mới', content: 'Thất bại' });
            setIsLoading(false);
            return;
        }
        const listImageFiltered = listItem.filter((item) => {
            return item.type === 'image';
        });

        formData.append('caption', content);

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

        await request
            .postForm(`/posts/create-post/${stateUser.id}`, formData, {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setIsLoading(false);
                createTwoButtonAlert({
                    title: 'Tạo bài viết mới',
                    content: 'Thành công',
                    navigateToHome: navigation.navigate('Home'),
                });
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
                createTwoButtonAlert({ title: 'Tạo post mới', content: 'Thất bại' });
            })
            .finally(() => {
                setIsLoading(false);
                setContent('');
                setListItem([]);
            });
    };
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
            setListItem(listItem.concat(listImageUri));
        }
    };

    return (
        <GestureHandlerRootView
            style={{ flex: 1, backgroundColor: COLORS.lightWhite, marginTop: 15 }}
        >
            {/* <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            ></TouchableWithoutFeedback> */}
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
            <View>
                <Card style={[styles.container, {}]}>
                    <View
                        style={{
                            height: height / 15,
                            borderBottomWidth: 2,
                            borderColor: COLORS.borderColor,
                            marginBottom: 10,
                            backgroundColor: COLORS.lightWhite,
                        }}
                    >
                        <Text style={{ fontFamily: FONT.medium, fontSize: FONT_SIZE.large }}>
                            Bài viết mới
                        </Text>
                    </View>

                    <View
                        style={{
                            paddingVertical: 10,
                            borderWidth: 2,
                            marginHorizontal: 10,
                            borderRadius: 10,
                            borderColor: COLORS.borderColor,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <OptionPrivacyIcon
                                status={statusModeComment}
                                IconComponent={
                                    <MaterialIcons name="comment" size={24} color="black" />
                                }
                                optionPrivacyrightRef={optionPrivacyrightRef}
                            />
                            {statusModeComment === ECommentRight.SPECIFIC && route.params && (
                                <Text>{route.params.selectedUsers.length} users</Text>
                            )}
                        </View>
                    </View>

                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <TextInput
                            placeholder="What do you think"
                            value={content}
                            onChangeText={setContent}
                            style={[styles.textInput, {}]}
                            multiline={true}
                            placeholderTextColor={COLORS.darkText}
                        />
                    </KeyboardAvoidingView>

                    <Card style={styles.row}>
                        <TouchableOpacity onPress={handlePickImage}>
                            <Feather name="image" size={24} color={color} />
                        </TouchableOpacity>
                        <Button title="Post" onPress={handleSubmit} />
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
                </Card>
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
            </View>
            <OptionPrivacyrights
                navigation={navigation}
                ref={optionPrivacyrightRef}
                setStatusModeComment={setStatusModeComment}
            />
            {/* </TouchableWithoutFeedback> */}
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
        width: '100%',
        margin: 8,
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
