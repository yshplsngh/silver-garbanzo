export interface PostType {
    id: number;
    title: string;
    body: string;
    views:number,
    tags:string[],
    reactions:{
        likes:number,
        dislikes:number
    }
}

export interface ResultType {
    posts: PostType[];
    limit: number;
    skip: number;
    total: number;
}