import express, {Router,Request,Response} from "express";
import {requireUser} from "../middleware/requireUser";
const router:Router = express.Router();

router.route('/').get(requireUser,(req:Request,res:Response)=>{
    res.status(200).send("working")
})

export {router as postRouter}