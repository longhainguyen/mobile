import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
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
    TouchableWithoutFeedback,
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
const { height, width } = Dimensions.get('window');

export default function Post({ navigation }: any) {
    const [content, setContent] = useState('');
    const color = useThemeColor({}, 'primary');
    const stateUser = useSelector((state: RootState) => state.reducerUser);
    const [isLoading, setIsLoading] = useState(false);
    const [listItem, setListItem] = useState<ItemItemProps[]>([]);

    const handleSubmit = async () => {
        const formData = new FormData();
        setIsLoading(true);
        if (listItem.length == 0 && content === '') {
            createTwoButtonAlert({ title: 'Tạo post mới', content: 'Thất bại' });
            setIsLoading(false);
            return;
        }
        var listImageFiltered = listItem.filter((item) => {
            return item.type === 'image';
        });

        formData.append('caption', content);
        var images: IImage[] = [];
        for (var i = 0; i < listImageFiltered.length; i++) {
            var _image: IImage = {
                name: listImageFiltered[i].name,
                type: listImageFiltered[i].type,
                uri: listImageFiltered[i].uri,
            };

            const r = await fetch(_image.uri);
            const _blobImage = await r.blob();

            formData.append('images', _blobImage, _image.name);
        }

        // const r = await fetch(listImageFiltered[0].uri);
        // const _blobImage = await r.blob();

        // formData.append('images', _blobImage, listImageFiltered[0].name);
        // var images: IImage[] = [];
        // listImageFiltered.map(async (image) => {
        //     var _image: IImage = {
        //         name: image.name,
        //         type: image.type,
        //         uri: image.uri,
        //     };

        //     const r = await fetch(_image.uri);
        //     const _blobImage = await r.blob();

        //     formData.append('images', _blobImage, _image.name);
        //     // console.log(formData);
        // });

        var listVideoFiltered = listItem.filter((item) => {
            return item.type === 'video';
        });

        var videos: Blob[] = [];
        listVideoFiltered.map(async (video) => {
            var _video: IVideo = {
                name: video.name,
                type: video.type,
                uri: video.uri,
            };

            const r = await fetch(_video.uri);
            const _blobVideo = await r.blob();

            formData.append('videos', _blobVideo, _video.name);
        });

        console.log(formData);

        await request
            .postForm(`/posts/create-post/${stateUser.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                console.log(response.data);

                setIsLoading(false);
                // setListItem([]);
                // setContent('');
                // createTwoButtonAlert({
                //     title: 'Tạo post mới',
                //     content: 'Thành công',
                //     navigateToHome: navigation.navigate('Home'),
                // });
            })
            .catch((e) => {
                console.log(e);

                setIsLoading(false);
                createTwoButtonAlert({ title: 'Tạo post mới', content: 'Thất bại' });
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
            setListItem(listImageUri);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
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
        </TouchableWithoutFeedback>
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
