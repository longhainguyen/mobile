import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { COLORS } from '../../constants';
import {
    Keyboard,
    TouchableOpacity,
    View,
    Text,
    Alert,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { setState } from '../../redux/stateComment/stateComment';
import { store } from '../../redux/Store';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import OptionIcon from './OptionIcon';
import { IPost } from '../../type/Post.type';
import { deletePost } from '../../api/post.api';
import createTwoButtonAlert from '../AlertComponent';
import { Entypo } from '@expo/vector-icons';
import { IUser } from '../../type/User.type';
import * as ImagePicker from 'expo-image-picker';
import { deleteAvatar, deleteBg, updateAvatar, updateBg } from '../../api/user.api';
import { setStateUser } from '../../redux/stateUser/stateUser';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
    idUser: string;
    idUserOfPost?: string;
    navigation?: any;
    post?: IPost;
    isShowImage?: boolean;
    image?: string;
    user?: IUser;
}

type Ref = BottomSheet;
const { height, width } = Dimensions.get('window');

const Option = forwardRef<Ref, Props>((props, ref) => {
    const [selectedImage, setSelectedImage] = useState<string>();
    const snapPoints = useMemo(() => ['40%'], []);
    const [isLoading, setIsLoading] = useState(false);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );

    const handleSheetChanges = useCallback((index: number) => {
        if (index == -1) {
            Keyboard.dismiss();
        }
        store.dispatch(setState(index));
    }, []);

    const handleEdit = () => {
        if (ref && typeof ref === 'object' && 'current' in ref) {
            ref.current?.close();

            props.navigation.navigate('EditPost', {
                post: props.post,
            });
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this post?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Deletion cancelled'),
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            if (props.post?.id && props.idUser) {
                                const response = await deletePost(
                                    {
                                        userId: parseInt(props.idUser),
                                    },
                                    props.post?.id,
                                );

                                createTwoButtonAlert({ content: 'Success', title: 'Deletion' });
                            }
                        } catch (error) {
                            createTwoButtonAlert({ content: 'Error', title: 'Deletion' });
                        } finally {
                            if (ref && typeof ref === 'object' && 'current' in ref) {
                                ref.current?.close();
                            }
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true },
        );
    };

    const handlePickImage = async (type: string) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            try {
                setIsLoading(true);

                if (type === 'bg') {
                    updateBg(result.assets[0].uri + '', props.idUser)
                        .then(async (response) => {
                            setIsLoading(false);
                            console.log(response.data);
                            const userString = await AsyncStorage.getItem('User');
                            if (userString) {
                                const user = JSON.parse(userString);
                                user.profile.background = response.data.background;
                                store.dispatch(setStateUser(user));
                                await AsyncStorage.setItem('User', JSON.stringify(user));
                            }
                            alert('Update background success');
                        })
                        .catch((e) => {
                            console.log(e);
                            alert('Update background fail');
                        })
                        .finally(() => {
                            if (ref && typeof ref === 'object' && 'current' in ref) {
                                ref.current?.close();
                            }
                        });
                } else if (type === 'avatar') {
                    updateAvatar(result.assets[0].uri + '', props.idUser)
                        .then(async (response) => {
                            setIsLoading(false);
                            console.log(response.data);
                            const userString = await AsyncStorage.getItem('User');
                            if (userString) {
                                const user = JSON.parse(userString);
                                user.profile.avatar = response.data.avatar;
                                store.dispatch(setStateUser(user));
                                await AsyncStorage.setItem('User', JSON.stringify(user));
                            }
                            alert('Update avatar success');
                        })
                        .catch((e) => {
                            console.log(e);
                            alert('Update avatar fail');
                        })
                        .finally(() => {
                            if (ref && typeof ref === 'object' && 'current' in ref) {
                                ref.current?.close();
                            }
                        });
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('You did not select any image.');
        }
    };

    const handleShowAvatar = () => {
        // console.log(props.user?.id);

        props.navigation.navigate('ShowImage', {
            sources: [{ url: props.user?.profile.avatar }],
        });
    };

    const handleShowBG = () => {
        props.navigation.navigate('ShowImage', {
            sources: [{ url: props.user?.profile.background }],
        });
    };

    const handleDeleteImage = async () => {
        try {
            if (props.image === 'avatar') {
                const response = await deleteAvatar(props.user?.id + '');
                const userString = await AsyncStorage.getItem('User');
                if (userString) {
                    const user = JSON.parse(userString);
                    user.profile.avatar = response.data.avatar;
                    store.dispatch(setStateUser(user));
                    await AsyncStorage.setItem('User', JSON.stringify(user));
                }
            } else if (props.image === 'bg') {
                const response = await deleteBg(props.user?.id + '');
                const userString = await AsyncStorage.getItem('User');
                if (userString) {
                    const user = JSON.parse(userString);
                    user.profile.background = response.data.avatar;
                    store.dispatch(setStateUser(user));
                    await AsyncStorage.setItem('User', JSON.stringify(user));
                }
            }

            alert('Delete image success');
        } catch (error) {
            alert('Delete image fail');
            console.log(error);
        } finally {
            if (ref && typeof ref === 'object' && 'current' in ref) {
                ref.current?.close();
            }
        }
    };

    return (
        <BottomSheet
            ref={ref}
            enablePanDownToClose={true}
            index={-1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: COLORS.lightWhite }}
            onChange={handleSheetChanges}
        >
            <BottomSheetView>
                {props.idUser === props.idUserOfPost ? (
                    <View>
                        {props.isShowImage && props.isShowImage === true ? (
                            <View>
                                <OptionIcon
                                    onPressOption={() => {
                                        if (props.image === 'avatar') {
                                            handlePickImage('avatar');
                                        } else if (props.image === 'bg') {
                                            handlePickImage('bg');
                                        }
                                    }}
                                    IconComponent={<Feather name="image" size={24} color="black" />}
                                    label="Chọn ảnh khác"
                                />

                                <OptionIcon
                                    onPressOption={() => {
                                        if (props.image === 'avatar') {
                                            handleShowAvatar();
                                        } else if (props.image === 'bg') {
                                            handleShowBG();
                                        }
                                    }}
                                    IconComponent={
                                        <Entypo name="resize-full-screen" size={24} color="black" />
                                    }
                                    label="Xem ảnh"
                                />
                                <OptionIcon
                                    onPressOption={async () => {
                                        await handleDeleteImage();
                                    }}
                                    IconComponent={
                                        <AntDesign name="delete" size={24} color="black" />
                                    }
                                    label="Xóa ảnh"
                                />
                            </View>
                        ) : (
                            <View>
                                <OptionIcon
                                    onPressOption={() => {
                                        handleDelete();
                                    }}
                                    IconComponent={
                                        <AntDesign name="delete" size={24} color="black" />
                                    }
                                    label="Delete"
                                />
                                <OptionIcon
                                    onPressOption={() => {
                                        handleEdit();
                                    }}
                                    IconComponent={
                                        <AntDesign name="edit" size={24} color="black" />
                                    }
                                    label="Edit"
                                />
                            </View>
                        )}
                    </View>
                ) : (
                    <View>
                        {props.isShowImage && props.isShowImage === true ? (
                            <View>
                                <OptionIcon
                                    onPressOption={() => {
                                        if (props.image === 'avatar') {
                                            handleShowAvatar();
                                        } else if (props.image === 'bg') {
                                            handleShowBG();
                                        }
                                    }}
                                    IconComponent={
                                        <Entypo name="resize-full-screen" size={24} color="black" />
                                    }
                                    label="Xem ảnh"
                                />

                                <OptionIcon
                                    IconComponent={<Feather name="flag" size={24} color="black" />}
                                    label="Báo cáo"
                                />
                            </View>
                        ) : (
                            <View>
                                <OptionIcon
                                    IconComponent={<Feather name="flag" size={24} color="black" />}
                                    label="Báo cáo"
                                />
                            </View>
                        )}
                    </View>
                )}
            </BottomSheetView>
        </BottomSheet>
    );
});

export default Option;
