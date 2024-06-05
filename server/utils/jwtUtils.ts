import jwt from "jsonwebtoken";
import {PRIVATE_KEY, PUBLIC_KEY} from "./config";
import {prisma} from "./pgConnect";

export const signJWT = (data:Object, options?: jwt.SignOptions | undefined) => {
    return jwt.sign(
        data,
        PRIVATE_KEY,
        {...(options && options), algorithm: "RS256"}
    );
}

interface decodedTokenType {
    id: number,
    email: string,
    name: string,
    picture: string
}

export const validateToken = (token: string) => {
    try {
        const decoded:decodedTokenType = jwt.verify(token, PUBLIC_KEY) as decodedTokenType;
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
            id: decoded.id
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