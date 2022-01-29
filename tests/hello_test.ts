import { assertEquals } from 'https://deno.land/std@0.123.0/testing/asserts.ts';
import { delay } from 'https://deno.land/std@0.123.0/async/delay.ts';

Deno.test('Hello world 😀', async () => {
    await delay(100);
    assertEquals(0, 0);
});
