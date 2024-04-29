const PostData = [
    {
        id: 1,
        time: '2024-04-25T11:03:36.000Z',
        images: [
            require('../assets/images/avatar.jpeg'),
            require('../assets/images/backgound.jpeg'),
            require('../assets/images/spiderman.jpeg'),
        ],
        videos: [require('../assets/videos/Download.mp4')],
        share: 10,
        like: 10,
        comments: [1, 2, 3],
        description:
            'Người nhện ngầu quá, nhưng mà không có đc em. Chúng ta của hiện tại, em dành cả thanh xuân cho anh. Anh dành cả thanh xuân cho em. Chúng ta dành cả thanh xuân cho nhau mà không hề nghĩ suy. Gặp nhau là duyên phận, xa nhau cũng là duyên phận. Chẳng ai biết tương lai sau này. Dù sau này có nhau hay không thể bên nhau cũng đừng quên rằng chúng ta đã dành tất cả điều tuyệt vời nhất cho nhau. Thương em',
    },
    {
        id: 2,
        time: '2024-04-26T11:03:36.000Z',
        images: [
            require('../assets/images/avatar.jpeg'),
            require('../assets/images/avatar.jpeg'),
            require('../assets/images/avatar.jpeg'),
        ],
        share: 10,
        like: 10,
        comments: [1, 2, 3],
        videos: [],
        description: 'Người nhện ngầu quá, nhưng mà không có đc em',
    },
    {
        id: 3,
        time: '2024-04-26T11:03:36.000Z',
        share: 10,
        like: 10,
        comments: [1, 2, 3],
        images: [
            require('../assets/images/avatar.jpeg'),
            require('../assets/images/avatar.jpeg'),
            require('../assets/images/avatar.jpeg'),
        ],
        videos: [],
        description: 'Người nhện ngầu quá, nhưng mà không có đc em',
    },
];

export default PostData;
