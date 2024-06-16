import express, {CookieOptions} from "express";
import type {Request, Response, Router} from "express";
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";

import {PasswordFormSchema, RegisterFormSchema} from "../types/auth";
import returnMsg from "../utils/returnMsg";
import {prisma} from "../utils/pgConnect";
import {signJWT, validateToken} from "../utils/jwtUtils";
import {requireUser} from "../middleware/requireUser";
import {ATT} from "../utils/config";
import rateLimit from "../middleware/rateLimiter";

const router: Router = express.Router();

export const accessTokenCookieOptions: CookieOptions = {
    maxAge: 604800000,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
};

router.route('/register').post(rateLimit, async (req: Request, res: Response) => {
    try {
        const isValid = RegisterFormSchema.safeParse(req.body);
        if (!isValid.success) {
            const msg: string = returnMsg(isValid);
            return res.status(422).send({message: msg});
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
            return res.status(409).send({message: 'User already exists'});
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
            }
        })

        const accessToken = signJWT({user}, {expiresIn: ATT})
        const refreshToken = signJWT({user}, {expiresIn: "1y"})

        const {decoded} = validateToken(accessToken);
        const refreshTokenCookieOptions: CookieOptions = {
            ...accessTokenCookieOptions,
            maxAge: 3.154e10, // 1 year
        };

        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

        return res.status(200).send(decoded);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})

router.route('/me').get(requireUser, (req: Request, res: Response) => {
    // console.log(res.locals.user)
    return res.status(200).send(res.locals.user)
})


router.route('/resetPassword').post(requireUser, async (req: Request, res: Response) => {
    try {
        // console.log(req.body);
        const isValid = PasswordFormSchema.safeParse(req.body);
        if (!isValid.success) {
            const msg: string = returnMsg(isValid);
            return res.status(422).send({message: msg});
        }
        const userFound = await prisma.user.findUnique({
            where: {id: isValid.data.id}
        })
        if (!userFound) {
            return res.status(404).send({message: 'User not found'});
        }

        const isPMatch = await bcrypt.compare(isValid.data.oldPassword, userFound.password)
        if (!isPMatch) {
            return res.status(401).send({message: "Invalid Old Password"})
        }

        const newHashedPassword = await bcrypt.hash(isValid.data.newPassword, 10);

        const result = await prisma.user.update({
            data: {password: newHashedPassword},
            where: {id: isValid.data.id}
        })
        if (!result) {
            return res.status(500).send({message: "operation Failed!"})
        }
        res.status(200).send({message: "Password Updated"});

    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
})


const sendEmail = async () => {
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        port: 465,
        auth: {
            user: 'yashpalsinght9@gmail.com',
            pass: 'sjypxncosczilqfc'
        }
    });

    let info = await transporter.sendMail({
        from: '"Yashpal Singh" <yashpalsinght9@gmail.com>',
        to: "@gmail.com",
        subject: "yashpal is boss",
        text: "Yashpal Maharaj ki Jay",
        html: "<b>Hello testing mail</b>"
    })

    console.log(info)
}

export {router as userRouter, sendEmail}