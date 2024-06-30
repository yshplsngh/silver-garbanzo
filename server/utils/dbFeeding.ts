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
    console.log(isDataExists);
    if (isDataExists == 250) {
        return;
    }
    let status = 0;
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
        status += 1;
        console.log(`Status: ${status / 2.5}`);
    })
}

// sudo -i -u postgres