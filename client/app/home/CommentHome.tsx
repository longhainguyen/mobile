import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UserData from '../../dataTemp/UserData';
import Comment from '../../compoments/Comment';
import { useEffect, useRef } from 'react';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import { COLORS } from '../../constants';

type CommentHomeProps = {
    route: any;
    navigation: any;
};

const CommentHome = ({ route, navigation }: CommentHomeProps) => {
    const bottemSheet = useRef<BottomSheetModal>(null);

    return (
        <GestureHandlerRootView style={{ flex: 1, marginTop: 15 }}>
            <Comment
                title="Bình luận"
                atSinglePost={false}
                ref={bottemSheet}
                avatar={UserData[0].avatar}
            />
        </GestureHandlerRootView>
    );
};

export default CommentHome;
