import jwt from "jsonwebtoken";
import {PRIVATE_KEY, PUBLIC_KEY} from "./config";
import {NextFunction} from "express";
import {prisma} from "./pgConnect";

export const signJWT = (data: Object, options?: jwt.SignOptions | undefined) => {
    return jwt.sign(
        {data},
        PRIVATE_KEY,
        {...(options && options), algorithm: "RS256"}
    );
}

export const validateToken = (token: string) => {
    try {
        const decoded: any = jwt.verify(token, PUBLIC_KEY)
        return {
            expired: false,
            decoded
        }
    } catch (error: any) {
        return {
            expired: error.message === 'jwt expired',
            decoded: null
        }
    }
}


export const reIssueAccessToken = async ({refreshToken}: { refreshToken: string }) => {
    const {decoded, expired} = validateToken(refreshToken);
    if (!decoded || expired) {
        return false;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.userId
        },
        select: {
            id: true,
            email: true,
            name: true,
            picture: true,
            createdAt: true,
        }
    });

    if(!user){
        return false;
    }
    return signJWT({user}, {expiresIn:"15m"});
}