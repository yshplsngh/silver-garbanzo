import {prisma} from "../utils/pgConnect";

export interface OTPDataType{
    id: number,
    otp: string,
    UserId: number,
    createdAt: Date,
    updatedAt: Date
}

export async function createNewOTP({userId, hashedOTP}: { userId: number, hashedOTP: string }):Promise<Omit<OTPDataType,'createdAt'|'updatedAt'>> {
    return prisma.otp.create({
        data: {
            otp: hashedOTP,
            UserId: userId
        }
    })
}

export async function getUserLatestOTP({userId}: { userId: number }):Promise<OTPDataType|null> {
    return prisma.otp.findFirst({
        where: {
            UserId: userId
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}

export async function deleteManyOTP({userId}: { userId: number }) {
    return prisma.otp.deleteMany({
        where:{
            UserId:userId
        }
    })
}