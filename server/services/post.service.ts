import {prisma} from "../utils/pgConnect";

export async function getPosts({nLimit,nSkip}:{nLimit:number,nSkip:number}){
    return prisma.post.findMany(
        {
            take: nLimit,
            skip: nSkip,
            include:{
                reactions:true
            }
        },
    )
}

export async function getTotalPostsCount():Promise<number>{
    return prisma.post.count();
}