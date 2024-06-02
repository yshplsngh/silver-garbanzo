import express, {CookieOptions} from "express";
import type {Request, Response, Router} from "express";
import bcrypt from 'bcrypt'

import {RegisterFormSchema} from "../types/auth";
import returnMsg from "../utils/returnMsg";
import {prisma} from "../utils/pgConnect";
import {signJWT} from "../utils/jwtUtils";
import {requireUser} from "../middleware/requireUser";

const router: Router = express.Router();

export const accessTokenCookieOptions: CookieOptions = {
    maxAge: 900000,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
};

router.route('/register').post(async (req: Request, res: Response) => {
    try {
        const isValid = RegisterFormSchema.safeParse(req.body);
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
        const accessToken = signJWT({user},{expiresIn:"15m"})
        const refreshToken = signJWT({user},{expiresIn:"1y"})

        const refreshTokenCookieOptions: CookieOptions = {
            ...accessTokenCookieOptions,
            maxAge: 3.154e10, // 1 year
        };

        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken,refreshTokenCookieOptions);

        return res.status(200).send({user});
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})

router.route('/me').get(requireUser,(req: Request, res: Response) => {
    return res.status(200).send(res.locals.user)
})

export {router as userRouter}