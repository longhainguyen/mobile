import { IPostOfSearch } from './ResultSearch.type';
import { IUser } from './User.type';

export type IHistorySearchItem =
    | { type: 'user'; user: IUser }
    | { type: 'post'; post: IPostOfSearch }
    | { type: 'text'; content: string };
