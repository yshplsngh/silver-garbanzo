/*
  Warnings:

  - You are about to drop the `OTPverify` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "OTPverify";

-- CreateTable
CREATE TABLE "Otpverify" (
    "id" SERIAL NOT NULL,
    "otp" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otpverify_pkey" PRIMARY KEY ("id")
);
