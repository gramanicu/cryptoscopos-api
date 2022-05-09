import { PrismaClient } from '@prisma/client';
import GeckoService from '../src/services/gecko.service';
import CoinService from '../src/services/coins.service';
const prisma = new PrismaClient();

async function main() {
    const coins = await GeckoService.get_top(25);
    let added = 0;

    for (const coin of coins) {
        const res = await CoinService.store(coin.coingeckoId);

        if (res) {
            added++;
        }
    }

    console.log(`Added pr updated ${added} coins of the database`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
