import express from "express";
import type { Request, Response,Router } from "express";

import {SignupFormSchema} from "../types/auth";
import returnMsg from "../utils/returnMsg";
const router:Router = express.Router();

router.route('/register').post((req:Request,res:Response)=>{
    const isValid = SignupFormSchema.safeParse(req.body);
    if(!isValid.success){
        const msg:string = returnMsg(isValid);
        return res.status(422).send(msg);
    }
})



export {router as authRouter}