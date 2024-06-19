import express, {CookieOptions} from "express";
import type {Request, Response, Router} from "express";
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";

import {OTPDataType, OTPVerifyDataType, PasswordFormSchema, RegisterFormSchema, UserCDataType} from "../types/auth";
import returnMsg from "../utils/returnMsg";
import {prisma} from "../utils/pgConnect";
import {signJWT, validateToken} from "../utils/jwtUtils";
import {requireUser} from "../middleware/requireUser";
import {ATT, EMAIL, EMAIL_PASS} from "../utils/config";
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

        if (userFound) return res.status(409).send({message: 'User already exists'});

        const hashedPass = await bcrypt.hash(isValid.data.password, 10);

        const user: UserCDataType = await prisma.user.create({
            data: {
                email: isValid.data.email,
                password: hashedPass,
                name: isValid.data.name,
                picture: isValid.data.picture,
                verified: false
            },
            select: {
                id: true,
                email: true,
                name: true,
                picture: true,
                verified: true
            }
        })

        if (!user) return res.status(500).send({message: "operation Failed!"});

        //TODO: here i will call sendOTP function
        // await sendOTPEmail({email:user.email,userId:user.id});

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


router.route('/sendOTP').post(requireUser, async (req: Request, res: Response) => {
    try {

        const isValid = OTPDataType.safeParse(req.body)
        if (!isValid.success) {
            const msg: string = returnMsg(isValid);
            return res.status(422).send({message: msg})
        }

        const otp = `${Math.floor(1000 + Math.random() * 9000)}`

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            port: 465,
            auth: {
                user: EMAIL,
                pass: EMAIL_PASS
            }
        });

        const hashedOTP = await bcrypt.hash(otp, 10);
        const saveOTP = await prisma.otpverify.create({
            data: {
                otp: hashedOTP,
                UserId: isValid.data.userId
            }
        })

        if (!saveOTP) return res.status(500).send({message: "Operation Failed!"})

        await transporter.sendMail({
            from: '"Brain Op" <yashpalsinght9@gmail.com>',
            to: isValid.data.email,
            subject: "SignUp Verification for BrainOp",
            text: "SignUp Verification for BrainOp",
            html: `<b>Enter ${otp} in the app to verify your email address</b>`
        })

        return res.status(200).send({message: "Email send Successfully"})

    } catch (error) {
        console.log(error);
        return error
    }
})


router.route('/verifyOTP').post(requireUser, async (req: Request, res: Response) => {
    try {
        const isValid = OTPVerifyDataType.safeParse(req.body);
        if (!isValid.success) {
            const msg: string = returnMsg(isValid);
            return res.status(422).send({message: msg});
        }

        const userFound = await prisma.user.findUnique({
            where:{
                id:isValid.data.userId
            }
        })
        if (!userFound) return res.status(404).send({message: 'User not found'});

        const OTP = await prisma.otpverify.findFirst({
            where:{
                UserId:isValid.data.userId
            },
            orderBy:{
                createdAt:"desc"
            }
        })

        if(!OTP) return res.status(404).send({message:"Account record does not exist or verified already, please Sign up"});


        if((Date.now()-OTP.createdAt.getTime())>600000){
            await prisma.otpverify.deleteMany({
                where:{
                    UserId:isValid.data.userId
                }
            })

            return res.status(410).send({message:"OTP is expired, please Request new OTP!"});
        }

        const isOTPMatch = await bcrypt.compare(isValid.data.otp,OTP.otp)
        if(!isOTPMatch) return res.status(400).send({message:"Invalid OTP passed, check your inbox"});

        await prisma.$transaction([
            prisma.user.update({
                data:{
                    verified:true
                },
                where:{
                    id:isValid.data.userId
                }
            }),
            prisma.otpverify.deleteMany({
                where:{
                    UserId:isValid.data.userId
                }
            })
        ])

        return res.status(200).send({message:"Account verified"});

    } catch (error){
        console.log(error);
        return error
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
        if (!userFound) return res.status(404).send({message: 'User not found'});

        const isPMatch = await bcrypt.compare(isValid.data.oldPassword, userFound.password)
        if (!isPMatch) return res.status(401).send({message: "Invalid Old Password"});

        const newHashedPassword = await bcrypt.hash(isValid.data.newPassword, 10);

        const result = await prisma.user.update({
            data: {password: newHashedPassword},
            where: {id: isValid.data.id}
        })
        if (!result) return res.status(500).send({message: "operation Failed!"});

        res.status(200).send({message: "Password Updated"});

    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
})


export {router as userRouter}