import React, { memo, useState } from 'react';
import { Dimensions, Modal, View, Text, ImageSourcePropType } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { RouteProp, NavigationProp } from '@react-navigation/native';
import { IImage } from '../type/Post.type';

type ShowImageProps = {
    route: any;
    navigation: any;
};

const { height, width } = Dimensions.get('window');

const ShowImage = ({ route, navigation }: ShowImageProps) => {
    const { index, sources } = route.params;

    const onBack = () => {
        navigation.goBack();
    };

    const images = sources.map((source: IImage) => {
        const image = {
            url: source.uri,
            props: {
                // headers: ...
            },
        };
        return image;
    });
    return (
        <Modal
            visible={true}
            presentationStyle="overFullScreen"
            statusBarTranslucent={true}
            transparent={true}
            animationType="slide"
            onRequestClose={() => onBack()}
        >
            <ImageViewer
                style={{
                    width: width,
                    height: height,
                }}
                imageUrls={images}
                index={index}
                onSwipeDown={() => {
                    onBack();
                }}
                enableSwipeDown={true} // Cho phép vuốt xuống để đóng ImageViewer
                // backgroundColor="transparent" // Đặt màu nền của ImageViewer thành trong suốt
                enableImageZoom={true}
            ></ImageViewer>
        </Modal>
    );
};

export default ShowImage;
