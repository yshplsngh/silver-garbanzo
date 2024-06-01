import express from "express";
import type {Request, Response, Router} from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


import {SignupFormSchema} from "../types/auth";
import returnMsg from "../utils/returnMsg";
import {prisma} from "../utils/pgConnect";
import {ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET} from "../utils/config";

const router: Router = express.Router();

router.route('/register').post(async (req: Request, res: Response) => {
    try {
        const isValid = SignupFormSchema.safeParse(req.body);
        if (!isValid.success) {
            const msg: string = returnMsg(isValid);
            return res.status(422).send(msg);
        }
        const userFound = await prisma.user.findUnique({
            where: {
                email: isValid.data.email
            },
            select: {
                email: true
            }
        })

        if (userFound) {
            return res.status(409).send('User already exists');
        }

        const hashedPass = await bcrypt.hash(isValid.data.password, 10);

        const user = await prisma.user.create({
            data: {
                email: isValid.data.email,
                password: hashedPass,
                name: isValid.data.name,
                picture: isValid.data.picture,
            },
            select: {
                id: true,
                email: true,
                name: true,
                picture: true,
                createdAt: true,
            }
        })

        const accessToken = jwt.sign({user}, ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
        const refreshToken = jwt.sign({user}, REFRESH_TOKEN_SECRET, {expiresIn: "7d"});



        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})
export {router as authRouter}