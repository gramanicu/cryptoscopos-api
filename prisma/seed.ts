import { PrismaClient } from '@prisma/client';
import GeckoService from '../src/services/gecko.service';
const prisma = new PrismaClient();

async function main() {
    const coins = await GeckoService.get_top(25);
    let added = 0;

    for (const coin of coins) {
        const res = await prisma.coin.upsert({
            where: {
                coingeckoId: coin.coingeckoId,
            },
            update: {},
            create: {
                coingeckoId: coin.coingeckoId,
                name: coin.name,
                symbol: coin.symbol,
            },
        });

        if (res) {
            added++;
        }
    }

    console.log(`Added ${added} coins to the database`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
