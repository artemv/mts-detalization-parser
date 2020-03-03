import test from 'ava';
import {commonSetup} from './common';

commonSetup(test);

test('Basic test', async (t) => {
  const browser = (t.context as any).app.client;
  const count = await browser.getWindowCount();
  t.is(count, 1, "initial windows count");
});
