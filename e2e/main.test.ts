import { commonSetup } from './common';
const test = require('ava');

commonSetup(test);

test('Basic test', async (t) => {
    const browser = t.context.app.client;
    const count = await browser.getWindowCount();
    t.is(count, 1, "initial windows count");
});
