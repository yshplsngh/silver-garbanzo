import rateLimiter, {Options} from "express-rate-limit";
import {Request, Response, NextFunction} from "express";

const rateLimit = rateLimiter({
    windowMs: 60 * 1000,
    limit: 100,
    message:
        {message: 'Too many login attempts from this IP, please try again after a 60 second pause'},
    handler: (req:Request, res:Response, next:NextFunction, options:Options) => {
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

export default rateLimit