import express, {CookieOptions} from "express";
import type {Request, Response, Router} from "express";
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";

import {
    OTPDataType,
    OTPFormSchema,
    PasswordFormSchema,
    RegisterFormSchema,
} from "../types/auth";
import returnMsg from "../utils/returnMsg";
import {signJWT, validateToken} from "../utils/jwtUtils";
import {requireUser} from "../middleware/requireUser";
import {ATT, EMAIL, EMAIL_PASS} from "../utils/config";
import rateLimit from "../middleware/rateLimiter";
import {
    createNewUser,
    getUserByEmail,
    getUserById,
    getUserByIdWithPass,
    updateUserById,
    UserDataType
} from "../services/user.service";
import {createNewOTP, deleteManyOTP, getUserLatestOTP} from "../services/otp.service";

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
        const userFound = await getUserByEmail({userEmail: isValid.data.email})

        if (userFound) return res.status(409).send({message: 'User already exists'});

        const hashedPass = await bcrypt.hash(isValid.data.password, 10);

        const user = await createNewUser({userData: isValid.data, hashedPass: hashedPass})

        if (!user) return res.status(500).send({message: "operation Failed!"});


        const accessToken = signJWT({user}, {expiresIn: ATT})
        const refreshToken = signJWT({user}, {expiresIn: "1y"})

        const {decoded} = validateToken(accessToken);
        const refreshTokenCookieOptions: CookieOptions = {
            ...accessTokenCookieOptions,
            maxAge: 3.154e10, // 1 year
        };

        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

        return res.status(201).send(decoded);
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

        const OTP: string = `${Math.floor(1000 + Math.random() * 9000)}`

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            port: 465,
            auth: {
                user: EMAIL,
                pass: EMAIL_PASS
            }
        });

        const hashedOTP = await bcrypt.hash(OTP, 10);

        const saveOTP = await createNewOTP({userId: isValid.data.userId, hashedOTP: hashedOTP})
        if (!saveOTP) return res.status(500).send({message: "Operation Failed!"})

        await transporter.sendMail({
            from: '"Brain Op" <yashpalsinght9@gmail.com>',
            to: isValid.data.email,
            subject: "SignUp Verification for BrainOp",
            text: "SignUp Verification for BrainOp",
            html: `<b>Enter ${OTP} in the app to verify your email address</b>`
        })

        return res.status(201).send({message: "Email send Successfully"})

    } catch (error) {
        console.log(error);
        return error
    }
})


router.route('/verifyOTP').post(requireUser, async (req: Request, res: Response) => {
    try {
        const isValid = OTPFormSchema.safeParse(req.body);
        if (!isValid.success) {
            const msg: string = returnMsg(isValid);
            return res.status(422).send({message: msg});
        }

        const userFound = await getUserById({userId: isValid.data.userId})
        if (!userFound) return res.status(404).send({message: 'User not found'});

        const OTP = await getUserLatestOTP({userId: isValid.data.userId})
        if (!OTP) return res.status(404).send({message: "Account record does not exist or verified already, please Sign up"});

        if ((Date.now() - OTP.createdAt.getTime()) > 600000) {
            await deleteManyOTP({userId: isValid.data.userId});
            return res.status(410).send({message: "OTP is expired, please Request new OTP!"});
        }

        const isOTPMatch = await bcrypt.compare(isValid.data.otp, OTP.otp)
        if (!isOTPMatch) return res.status(400).send({message: "Invalid OTP passed, check your inbox"});

        const userUpdates:Pick<UserDataType, 'verified'> = {
            verified:true,
        }

        await deleteManyOTP({userId: userFound.id})
        await updateUserById({userId:userFound.id,userData:userUpdates})

        return res.status(200).send({message: "Account verified"});

    } catch (error) {
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


        const userFound = await getUserByIdWithPass({userId:isValid.data.id})
        if (!userFound) return res.status(404).send({message: 'User not found'});

        const isPMatch = await bcrypt.compare(isValid.data.oldPassword, userFound.password)
        if (!isPMatch) return res.status(401).send({message: "Invalid Old Password"});

        const newHashedPassword = await bcrypt.hash(isValid.data.newPassword, 10);

        const userUpdates:Pick<UserDataType,'password'> = {
            password:newHashedPassword
        }

        const result = await updateUserById({userId:userFound.id,userData:userUpdates})
        if (!result) return res.status(500).send({message: "operation Failed!"});

        res.status(200).send({message: "Password Updated"});

    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
})

export {router as userRouter}