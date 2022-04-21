/*
  Warnings:

  - A unique constraint covering the columns `[coinId,timestamp]` on the table `coin_data` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "coin_data_coinId_timestamp_key" ON "coin_data"("coinId", "timestamp");
