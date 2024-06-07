import { Fragment, useEffect } from "react";
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import axios from "axios";

interface PostType {
    id: number;
    title: string;
    body: string;
    // Add other post fields if necessary
}

interface ResultType {
    posts: PostType[];
    limit: number;
    skip: number;
    total: number;
}

const Post = () => {
    /* pageParam is actually a skipped number but it must be named with pageParam */

    const fetchDummyPosts = async ({ pageParam = 0 }) => {
        const res = await axios.get(`https://dummyjson.com/posts?limit=12&skip=${pageParam}`);
        return res.data;
    };

    const {
        data,
        error,
        isLoading,
        isError,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: fetchDummyPosts,
        initialPageParam: 0,
        refetchOnWindowFocus:false,
        retry:false,
        getNextPageParam: (lastPage: ResultType) => {
            const { skip, limit, total } = lastPage;
            const nextPage = skip + limit;
            return nextPage < total ? nextPage : undefined;
        }
    });

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage]);

    if (isLoading) return <h1>Loading...</h1>;
    if (isError) return <h1>{(error as Error).message}</h1>;

    return (
        <div>
            {data?.pages.map((page: ResultType, pageIndex: number) => (
                <Fragment key={pageIndex}>
                    {page.posts.map((post: PostType) => (
                        <div key={post.id}>
                            <h2>{post.title}</h2>
                            <p>{post.body}</p>
                        </div>
                    ))}
                </Fragment>
            ))}

            <div ref={ref}>{isFetchingNextPage && 'Loading more posts...'}</div>
        </div>
    );
};

export default Post;
