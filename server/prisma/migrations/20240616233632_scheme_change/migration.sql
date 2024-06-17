/*
  Warnings:

  - Added the required column `verified` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verified" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "OTPverify" (
    "id" SERIAL NOT NULL,
    "otp" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OTPverify_pkey" PRIMARY KEY ("id")
);
