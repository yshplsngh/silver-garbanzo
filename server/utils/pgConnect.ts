import {PrismaClient} from '@prisma/client'

export const prisma = new PrismaClient();

export async function pgConnect(){
    try{
        await prisma.$connect();
        console.log("🚀 Database connected successfully");
    }catch (error){
        console.log(error);
        process.exit(1);
    }finally {
        await prisma.$disconnect();
    }
}