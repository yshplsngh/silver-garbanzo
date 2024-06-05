import {NextFunction,Request,Response} from "express";
import {reIssueAccessToken, validateToken} from "../utils/jwtUtils";
import {accessTokenCookieOptions} from "../routes/auth";

export const deserializeUser = async (req:Request,res:Response,next:NextFunction)=>{
    const accessToken = req.cookies?.accessToken
    const refreshToken = req.cookies?.refreshToken

    if(!accessToken){
        return next();
    }

    const {decoded,expired} = validateToken(accessToken);
    if(decoded){
        res.locals.user = decoded
        return next();
    }
    if(expired && refreshToken){
        const newAccessToken = await reIssueAccessToken(refreshToken);
        if(accessToken){
            res.cookie("accessToken", newAccessToken,accessTokenCookieOptions);
        }
        const result = validateToken(newAccessToken as string);

        res.locals.user = result.decoded;
        return next();
    }

    return next();
}