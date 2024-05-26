import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ImageSourcePropType,
    Dimensions,
    Image,
    Button,
} from 'react-native';
import { FONT, FONT_SIZE } from '../constants/font';
import { COLORS } from '../constants';
import { forwardRef, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { IFile, IImage } from '../type/Post.type';
import { Video, ResizeMode } from 'expo-av';

const { height, width } = Dimensions.get('window');
const maxLength = 100;

type ItemProps = {
    source: IFile;
    sources: IFile[];
    index: number;
    navigation: any;
};

type Ref = Video;

const Item = forwardRef<Ref, ItemProps>((props, ref) => {
    const video = useRef<Video>(null);
    const [status, setStatus] = useState({});

    return (
        <View>
            {!props.source.url ? (
                <View>
                    <Text>Ui Lỗi rồi hehe </Text>
                </View>
            ) : (
                <View>
                    {props.source.url.endsWith('.jpg') ||
                    props.source.url.endsWith('.png') ||
                    props.source.url.endsWith('.webp') ? (
                        <TouchableOpacity
                            style={{
                                height: height / 3,
                                width: width / 1.5,
                                borderRadius: 15,
                                backgroundColor: COLORS.gray,
                                marginRight: 15,
                            }}
                            onPress={() =>
                                props.navigation.navigate('ShowImage', {
                                    index: props.index,
                                    sources: props.sources,
                                })
                            }
                        >
                            <Image
                                style={{
                                    borderRadius: 15,
                                    resizeMode: 'cover',
                                    height: height / 3,
                                    width: width / 1.5,
                                }}
                                source={{ uri: props.source.url }}
                            ></Image>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity>
                            <View
                                style={{
                                    height: height / 3,
                                    width: width / 1.5,
                                    borderRadius: 15,
                                    backgroundColor: COLORS.gray,
                                    marginRight: 15,
                                }}
                            >
                                <Video
                                    ref={video}
                                    onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                                    style={{ alignSelf: 'center', width: '100%', height: '100%' }}
                                    source={{ uri: props.source.url }}
                                    useNativeControls
                                    isLooping
                                    resizeMode={ResizeMode.CONTAIN}
                                    // onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                                />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
});

interface PostContentProp {
    navigation: any;
    time: string;
    images: IFile[];
    description: string | null;
    videos: IFile[];
}

const PostContent = forwardRef<Ref, PostContentProp>((props, ref) => {
    const [showFullText, setShowFullText] = useState(false);
    const displayText = showFullText
        ? props.description || ''
        : props.description
        ? props.description.slice(0, maxLength)
        : '';
    return (
        <View style={{ marginHorizontal: 10, backgroundColor: COLORS.white }}>
            <Text
                style={{
                    fontFamily: FONT.regular,
                    fontSize: FONT_SIZE.small,
                    color: COLORS.textGrey,
                }}
            >
                {moment(props.time).startOf('minutes').fromNow()}
            </Text>
            {(props.images || props.videos) && (
                <SafeAreaView>
                    <FlatList
                        horizontal={true}
                        keyExtractor={(item, index) => index.toString()}
                        data={props.images.concat(props.videos)}
                        renderItem={({ index, item }) => (
                            <Item
                                ref={ref}
                                source={item}
                                sources={props.images}
                                index={index}
                                navigation={props.navigation}
                            />
                        )}
                    />
                </SafeAreaView>
            )}

            {props.description && (
                <View>
                    <Text
                        style={{
                            fontFamily: FONT.regular,
                            fontSize: FONT_SIZE.small,
                            color: COLORS.black,
                            marginTop: 10,
                        }}
                    >
                        {displayText}
                    </Text>

                    {props.description.length > maxLength && (
                        <TouchableOpacity onPress={() => setShowFullText(!showFullText)}>
                            <Text
                                style={{
                                    color: COLORS.black,
                                    fontFamily: FONT.medium,
                                    fontSize: FONT_SIZE.small,
                                }}
                            >
                                {showFullText ? 'Ẩn đi' : 'Xem thêm'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
});

export default PostContent;
