import jwt from "jsonwebtoken";
import {ATT, PRIVATE_KEY, PUBLIC_KEY} from "./config";
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
        // console.log('23');
        // console.log(decoded);
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

export const reIssueAccessToken = async (refreshToken:string) => {
    const {decoded, expired} = validateToken(refreshToken);

    if (decoded===null || expired) {
        console.log('Refresh token expired 38');
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
        }
    });
    console.log('find user from refreshtoken decoded id 53')
    // console.log(user)
    if(!user){
        console.log("user not found in 54");
        return false;
    }
    console.log('user present in RT token is found')
    return signJWT({user}, {expiresIn:ATT});
}