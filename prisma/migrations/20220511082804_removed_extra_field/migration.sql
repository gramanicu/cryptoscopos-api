/*
  Warnings:

  - You are about to drop the column `ticketSubscriberId` on the `ticket_messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ticket_messages" DROP COLUMN "ticketSubscriberId";
