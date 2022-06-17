/*
  Warnings:

  - You are about to drop the `ticket_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tickets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ticket_messages" DROP CONSTRAINT "ticket_messages_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "ticket_messages" DROP CONSTRAINT "ticket_messages_userId_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_userId_fkey";

-- DropTable
DROP TABLE "ticket_messages";

-- DropTable
DROP TABLE "tickets";

-- DropEnum
DROP TYPE "TicketTypes";
