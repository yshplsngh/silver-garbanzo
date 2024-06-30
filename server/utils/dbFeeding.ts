import axios from 'axios';
import {prisma} from "./pgConnect";

interface PostType {
    title: string;
    body: string;
    tags: string[];
    views: number;
    reactions: {
        likes: number;
        dislikes: number;
    }
}

export async function operation() {

    const isDataExists = await prisma.post.count();

    /*
    * Feed Posts only one time,
    * if data already exist, return
    * */
    if (isDataExists >= 250) {
        return;
    }
    let status = 0;
    let prevPer = -1;
    const res = await axios.get('https://dummyjson.com/posts?limit=250');
    res.data.posts.map(async (post: PostType, index: number) => {
        const dum = await prisma.post.create({
            data: {
                title: post.title,
                body: post.body,
                tags: post.tags,
                views: post.views,
                reactions: {
                    create: {
                        likes: post.reactions.likes,
                        dislikes: post.reactions.dislikes
                    }
                }
            }
        })

        /*
        * print only for one time,
        * print posts uploading status,
        * so that post status percentage don't repeat
        * */
        status += 1;
        let statusPer = Math.floor(status/2.5);
        if(statusPer!==prevPer){
            console.log(`posts uploading ${statusPer}%`);
        }
        prevPer = statusPer;
    })
}