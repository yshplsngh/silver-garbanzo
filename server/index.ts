import express from 'express'
import type {Express,Response,Request} from "express";
import cookieParser from 'cookie-parser'

const app:Express = express();
import {PORT} from "./utils/config";
import {authRouter} from "./routes/auth";
import {pgConnect} from "./utils/pgConnect";

app.use(cookieParser());
app.use(express.json());
//TODO - remove line if not use any HTML form
app.use(express.urlencoded({ extended: false }));


app.use('/health',(req:Request,res:Response)=>{
    return res.status(200).json({
        TimeStamp:Date.now(),
        RunTime:process.uptime()
    })
})
app.use('/api/auth/signup',authRouter)

app.listen(PORT,async ()=>{
    console.log('listening on port '+PORT);
    await pgConnect();
})