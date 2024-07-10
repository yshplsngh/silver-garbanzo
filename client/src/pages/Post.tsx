import {useEffect} from "react";
import {InfiniteQueryObserverResult, useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import {useInView} from 'react-intersection-observer';
import {bashApi} from "../api/bashApi.tsx";
import Loading from "../component/Loading.tsx";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {AxiosOMessageResponse} from "../features/UserProvider.tsx";
import {PostType, ResultType} from "../types/Post.ts";
import like from '../assets/like.png'
import dislike from '../assets/dislike.png'
import view from '../assets/eye.png'

const Post = () => {

    const queryClient = useQueryClient();
    const cachedData = queryClient.getQueryData<{ pageParams: number[], pages: ResultType[] }>(['posts'])

    // console.log(cachedData)

    /* pageParam is actually a skipped number but it must be named with pageParam */
    const fetchDummyPosts = async ({pageParam = 0}): Promise<ResultType> => {
        const res = await bashApi.get(`/post?limit=${10}&skip=${pageParam}`)
        return res.data;

    };

    const {
        data,
        error,
        isLoading,
        isError,
        fetchNextPage,
        isFetchingNextPage
    }: InfiniteQueryObserverResult<{
        pageParams: number[],
        pages: ResultType[]
    }, AxiosError<AxiosOMessageResponse>> = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: fetchDummyPosts,
        initialPageParam: 0,
        initialData: cachedData,
        refetchOnWindowFocus: false,
        retry: false,
        getNextPageParam: (lastPage: ResultType) => {
            const {skip, limit, total} = lastPage;
            const nextPage = skip + limit;
            return nextPage < total ? nextPage : undefined;
        }
    });

    console.log(data);

    const {ref, inView} = useInView();

    useEffect(() => {
        (async () => {
            if (inView) {
                await fetchNextPage();
            }
        })()
    }, [inView, fetchNextPage]);

    // console.log(data);

    if (isLoading) return <Loading/>
    if (isError) {
        console.log(error?.response)
        toast.error(error?.response?.data?.message || error.message);
    }

    // console.log(data)
    // console.log(cachedData)
    return (
        <section className={'scroll-smooth'}>
            {data?.pages.map((page: ResultType, pageIndex: number) => (
                <div key={pageIndex} className={'space-y-10'}>
                    {page.posts.map((post: PostType) => (
                        <div key={post.id} className={'flex justify-center op'}>
                            <div className={'w-[70%] border-b-2 pb-8'}>
                                <h2 className={'text-3xl font-semibold'}>{post.title}</h2>

                                <p className={'text-gray-800 text-xl mt-6'}>{post.body}</p>

                                <div className={'flex space-x-2 mt-10'}>
                                    {post.tags.map((tag, index) => (
                                        <div key={index}>
                                            <span className={'bg-gray-300 px-5 py-2 rounded-full'}>{tag}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className={'flex space-x-5 mt-6'}>
                                    <div className={'flex items-center'}>
                                        <img className={'w-4 h-4 mr-1'} src={view} alt=""/>
                                        <span>{post.views}</span>
                                    </div>
                                    <div className={'flex items-center'}>
                                        <img className={'w-4 h-4 mr-1'} src={like} alt=""/>
                                        <span>{post.reactions.likes}</span>
                                    </div>
                                    <div className={'flex items-center'}>
                                        <img className={'w-4 h-4 mr-1'} src={dislike} alt=""/>
                                        <span>{post.reactions.dislikes}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            ))}
            <div className={'text-red-500'}>{isError && `${error?.response?.data?.message}`}</div>
            <div ref={ref} className={'op pb-28'}>{isFetchingNextPage && <Loading/>}</div>
        </section>
    );
};

export default Post;
