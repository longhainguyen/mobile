import request from '../config/request';
import { IResultSearch } from '../type/ResultSearch.type';

interface IRequestSearchUser {
    keyword: string;
}

const searchUser = async (data: IRequestSearchUser, limit?: number, page?: number) => {
    return await request.get(`/users/find-by-name/`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
            keyword: data.keyword,
        },
        params: {
            limit: limit,
            page: page,
        },
    });
};

const searchPost = async (keyword?: string, limit?: number, page?: number) => {
    return await request.get<IResultSearch>(`/posts/search-posts/`, {
        params: {
            keyword: keyword,
            limit: limit,
            page: page,
        },
    });
};

export { searchUser, searchPost };
