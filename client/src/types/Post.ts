export interface PostType {
    id: number;
    title: string;
    body: string;
}

export interface ResultType {
    posts: PostType[];
    limit: number;
    skip: number;
    total: number;
}