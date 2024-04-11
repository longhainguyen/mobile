import { TouchableOpacity, View, Image, Text } from 'react-native';
import { COLORS } from '../constants';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FONT, FONT_SIZE } from '../constants/font';

interface InfoAccountProps {
    avatar: any;
    cover: any;
    name: string;
    isOwn: boolean;
    isFollow?: boolean;
}

const InfoAccount: React.FC<InfoAccountProps> = ({
    avatar,
    cover,
    name,
    isOwn,
    isFollow = false,
}) => {
    return (
        <View
            style={{
                borderBottomColor: COLORS.borderColor,
                borderBottomWidth: 2,
                paddingBottom: 30,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    <Image
                        style={{ alignSelf: 'flex-end', height: 200, width: '100%' }}
                        source={cover}
                    />
                    {isOwn && (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 5,
                                zIndex: 9999,
                                borderRadius: 50,
                                borderColor: 'white',
                                borderWidth: 2,
                                backgroundColor: COLORS.lightWhite,
                            }}
                        >
                            <MaterialIcons name="photo-camera" size={20}></MaterialIcons>
                        </View>
                    )}
                </TouchableOpacity>
                <View
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        width: '100%',
                        height: 150,
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity activeOpacity={0.6}>
                        <Image
                            style={{
                                width: 150,
                                height: '100%',
                                borderRadius: 85,
                                borderWidth: 2,
                                borderColor: COLORS.lightWhite,
                                opacity: 1,
                            }}
                            source={avatar}
                        />
                        {isOwn && (
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 15,
                                    zIndex: 9999,
                                    borderRadius: 50,
                                    borderColor: 'white',
                                    borderWidth: 2,
                                    backgroundColor: COLORS.lightWhite,
                                }}
                            >
                                <MaterialIcons
                                    name="photo-camera"
                                    size={20}
                                    color={'black'}
                                ></MaterialIcons>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    marginTop: 50,

                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        fontFamily: FONT.medium,
                        fontSize: FONT_SIZE.large,
                        textAlign: 'center',
                    }}
                >
                    {name}
                </Text>
                {isOwn ? (
                    <TouchableOpacity
                        style={{
                            borderRadius: 30,
                            borderWidth: 1,
                            borderColor: COLORS.black,
                            padding: 5,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: FONT.regular,
                                fontSize: FONT_SIZE.small,
                                textAlign: 'center',
                            }}
                        >
                            Chỉnh sửa trang cá nhân
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={{
                            borderRadius: 30,
                            borderWidth: 1,
                            borderColor: COLORS.black,
                            backgroundColor: isFollow ? COLORS.white : COLORS.green,
                            padding: 5,
                            paddingHorizontal: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: FONT.regular,
                                fontSize: FONT_SIZE.small,
                                textAlign: 'center',
                            }}
                        >
                            {isFollow ? 'Following' : 'Follow'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default InfoAccount;
