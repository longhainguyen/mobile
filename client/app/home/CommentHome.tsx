import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UserData from '../../dataTemp/UserData';
import Comment from '../../compoments/Comment';
import { useEffect, useRef } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { COLORS } from '../../constants';

type CommentHomeProps = {
    route: any;
    navigation: any;
};

const CommentHome = ({ route, navigation }: CommentHomeProps) => {
    const bottemSheet = useRef<BottomSheet>(null);

    return (
        <GestureHandlerRootView style={{ flex: 1, marginTop: 15 }}>
            <Comment
                backHome={() => navigation.goBack()}
                title="Bình luận"
                atHome={true}
                ref={bottemSheet}
                avatar={UserData[0].avatar}
            />
        </GestureHandlerRootView>
    );
};

export default CommentHome;
