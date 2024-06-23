import {RegisterFormType, UserCDataType} from "../types/auth";
import {prisma} from "../utils/pgConnect";

export interface UserDataType{
    id?: number,
    name?: string,
    email?: string,
    picture?: string,
    password?: string,
    verified?: boolean,
    createdAt?: Date,
    updatedAt?: Date
}

export async function getUserById({userId}:{userId: number}):Promise<UserCDataType|null> {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if(user){
        const {password,createdAt,updatedAt,...userWithoutPass} = user;
        return userWithoutPass;
    }
    return null;
}

export async function getUserByIdWithPass({userId}:{userId: number}) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if(user){
        const {id,password,...userWithoutPass} = user;
        return {id,password};
    }
    return null;
}

export async function getUserByEmail({userEmail}:{userEmail: string}) {
    return prisma.user.findUnique({
        where: {
            email: userEmail
        },
        select: {
            email: true
        }
    });
}


export async function createNewUser({userData,hashedPass}:{userData:RegisterFormType,hashedPass:string}):Promise<UserCDataType|null>{
    const user = await prisma.user.create({
        data: {
            email: userData.email,
            password: hashedPass,
            name: userData.name,
            picture: userData.picture,
            verified: false
        }
    })
    if(user){
        const {password,createdAt,updatedAt,...userWithoutPass} = user;
        return userWithoutPass;
    }
    return null;
}


export async function updateUserById({userId,userData}:{userId:number,userData:UserDataType}){
    return prisma.user.update({
        data:userData,
        where:{
            id:userId
        }
    })
}
