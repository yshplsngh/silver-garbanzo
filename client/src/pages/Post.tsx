import {useEffect } from "react";
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import {bashApi} from "../api/bashApi.tsx";
import Loading from "../component/Loading.tsx";
import {toast} from "sonner";

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
        // const res = await axios.get(`https://dummyjson.com/posts?limit=${25}&skip=${pageParam}`);
        const res = await bashApi.get(`/post?limit=${10}&skip=${pageParam}`)
        // console.log(typeof res)
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
            // console.log({ skip, limit, total });
            const nextPage = skip + limit;
            // console.log(nextPage);
            return nextPage < total ? nextPage : undefined;
        }
    });

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage]);

    if (isLoading) return <Loading/>
    if (isError) return toast.error(`${(error as Error).message}`);

    return (
        <section>
            {data?.pages.map((page: ResultType, pageIndex: number) => (
                <div key={pageIndex}>
                    {page.posts.map((post: PostType) => (
                        <div key={post.id}>
                            <h2>{post.title}</h2>
                            <p>{post.body}</p>
                        </div>
                    ))}
                </div>
            ))}
            <div>{isError && (error as Error).message}</div>
            <div ref={ref} className={'setting'}>{isFetchingNextPage && <Loading/>}</div>
        </section>
    );
};

export default Post;