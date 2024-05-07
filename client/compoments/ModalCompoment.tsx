import React from 'react';
import { Modal, TouchableOpacity, View, Text, Dimensions, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { COLORS } from '../constants';
import font from '../config/font';
import { FONT, FONT_SIZE } from '../constants/font';

const { height, width } = Dimensions.get('window');

interface ModalCompomentProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    logOut: () => void;
}

export default function ModalCompoment({
    modalVisible,
    setModalVisible,
    logOut,
}: ModalCompomentProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    setModalVisible(!modalVisible);
                }}
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.60)',
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                }}
            >
                <Pressable
                    style={{
                        backgroundColor: COLORS.lightWhite,
                        height: height / 4,
                        borderRadius: 30,
                    }}
                >
                    <TouchableOpacity
                        onPress={logOut}
                        style={{
                            marginTop: 15,
                            backgroundColor: COLORS.lightWhite,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            borderColor: COLORS.borderColor,
                            borderBottomWidth: 3,
                            paddingVertical: 15,
                            borderRadius: 50,
                            gap: 10,
                        }}
                    >
                        <Feather
                            style={{ marginLeft: 15 }}
                            name="log-out"
                            size={24}
                            color="black"
                        />
                        <Text style={{ fontFamily: FONT.regular, fontSize: FONT_SIZE.small }}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </Pressable>
            </TouchableOpacity>
        </Modal>
    );
}
