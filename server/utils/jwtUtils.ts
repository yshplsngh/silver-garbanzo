import jwt from "jsonwebtoken";
import {ATT, PRIVATE_KEY, PUBLIC_KEY} from "./config";
import {decodedTokenType, UserCDataType} from "../types/auth";
import {getUserById} from "../services/user.service";

export const signJWT = (data: Object, options?: jwt.SignOptions | undefined) => {
    return jwt.sign(
        data,
        PRIVATE_KEY,
        {...(options && options), algorithm: "RS256"}
    );
}


export const validateToken = async (token: string) => {
    try {
        const decoded: decodedTokenType = jwt.verify(token, PUBLIC_KEY) as decodedTokenType;
        /**
         * we can also directly send $decoded, but if some user info is updated then we need to update that
         * info in AT also
         */
        const updatedInfo = await getUserById({userId: decoded.user.id});
        if(!updatedInfo) {
            return {
                expired:false,
                decoded,
            }
        }
        /**
         * decoded also contain $iat and $exp, so we also need to send both with updated
         * user data.
         */
        return {
            expired: false,
            decoded: {iat: decoded.iat, exp: decoded.exp, user: updatedInfo},
        }
    } catch (error: any) {
        return {
            expired: error.message === 'jwt expired',
            decoded: null
        }
    }
}

export const reIssueAccessToken = async (refreshToken: string) => {
    const {decoded, expired} = await validateToken(refreshToken);

    if (decoded === null || expired) {
        // console.log('Refresh token expired 38');
        return false;
    }

    const user = await getUserById({userId: decoded.user.id});

    // console.log('find user from refreshtoken decoded id 53')
    // console.log(user)
    if (!user) {
        // console.log("user not found in 54");
        return false;
    }
    // console.log('user present in RT token is found')
    return signJWT({user}, {expiresIn: ATT});
}