/*
  Warnings:

  - Added the required column `isActive` to the `alerts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "alerts" ADD COLUMN     "isActive" BOOLEAN NOT NULL;
