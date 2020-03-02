import * as fs from 'fs';
import test from 'ava';
import MtsParser from "../main-process/MtsParser";

test('main', async (t) => {
  const parser = new MtsParser();
  const fixture = fs.readFileSync('test/fixtures/mts-one.txt', 'utf8');
  const result = await parser.run(fixture, '2019-01-01');
  t.is(result, 93370);
});
