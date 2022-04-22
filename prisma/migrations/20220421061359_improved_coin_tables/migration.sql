/*
  Warnings:

  - You are about to drop the column `name` on the `coin_informations` table. All the data in the column will be lost.
  - You are about to drop the column `symbol` on the `coin_informations` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `coin_informations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `coins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `coins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coin_informations" DROP COLUMN "name",
DROP COLUMN "symbol",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "coins" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL;
