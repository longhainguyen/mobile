import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ImageSourcePropType,
    Dimensions,
    Image,
} from 'react-native';
import { FONT, FONT_SIZE } from '../constants/font';
import { COLORS } from '../constants';
import { useState } from 'react';
import moment from 'moment';

const { height, width } = Dimensions.get('window');
const maxLength = 100;

type ItemProps = {
    source: any;
    sources: any[];
    index: number;
    navigation: any;
};

const Item = ({ source, index, sources, navigation }: ItemProps) => (
    <TouchableOpacity
        onPress={() => navigation.navigate('ShowImage', { index: index, sources: sources })}
        style={{
            height: height / 4,
            width: width / 2,
            borderRadius: 15,
            backgroundColor: COLORS.gray,
            marginRight: 15,
        }}
    >
        <Image
            style={{
                borderRadius: 15,
                resizeMode: 'cover',
                height: height / 4,
                width: width / 2,
            }}
            source={source}
        ></Image>
    </TouchableOpacity>
);

interface PostContentProp {
    navigation: any;
    time: string;
    images: ImageSourcePropType[] | null;
    description: string | null;
}

const PostContent: React.FC<PostContentProp> = ({ navigation, time, images, description }) => {
    const [showFullText, setShowFullText] = useState(false);
    const displayText = showFullText
        ? description || ''
        : description
        ? description.slice(0, maxLength)
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
                {moment(time).startOf('minutes').fromNow()}
            </Text>
            {images && (
                <SafeAreaView>
                    <FlatList
                        horizontal={true}
                        data={images}
                        renderItem={({ index, item }) => (
                            <Item
                                source={item}
                                sources={images}
                                index={index}
                                navigation={navigation}
                            />
                        )}
                    />
                </SafeAreaView>
            )}

            {description && (
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

                    {description.length > maxLength && (
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
};

export default PostContent;
