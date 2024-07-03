import express, {Router, Request, Response, query} from "express";
import {requireUser} from "../middleware/requireUser";
import {getPosts, getTotalPostsCount} from "../services/post.service";

const router: Router = express.Router();

router.route('/').get(requireUser,async (req: Request, res: Response) => {
    try {
        const {limit, skip} = req.query;

        /*query is by default string so convert into number with base 10*/
        const nLimit = parseInt(limit as string, 10);
        const nSkip = parseInt(skip as string, 10);

        const total = await getTotalPostsCount();
        if (total==0) {
            return res.status(422).send({message:"no posts found"});
        }

        const posts = await getPosts({nLimit:nLimit,nSkip:nSkip})
        console.log(posts);
        const result = {
            posts: posts,
            limit: nLimit,
            skip: nSkip,
            total: total
        }

        res.status(200).send(result)
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})

export {router as postRouter}