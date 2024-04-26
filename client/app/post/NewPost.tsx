import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Button, Card, useThemeColor } from '../../compoments/Themed';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../constants';

export default function Post() {
    const [content, setContent] = useState('');
    const color = useThemeColor({}, 'primary');

    const [image, setImage] = useState('');

    const handleSubmit = () => {
        setContent('');
        setImage('');
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <Card style={styles.container}>
            <TextInput
                placeholder="What do you think"
                value={content}
                onChangeText={setContent}
                style={styles.textInput}
            />

            <Card style={styles.row}>
                <TouchableOpacity onPress={handlePickImage}>
                    <Feather name="image" size={24} color={color} />
                </TouchableOpacity>
                <Button title="Post" onPress={handleSubmit} />
            </Card>

            {image && (
                <ImageBackground source={{ uri: image }} style={styles.image}>
                    <TouchableOpacity style={styles.imageButton} onPress={() => setImage('')}>
                        <Feather name="x" size={16} color="black" />
                    </TouchableOpacity>
                </ImageBackground>
            )}
        </Card>
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
