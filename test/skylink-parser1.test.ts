import * as fs from 'fs';
import test from 'ava';
import SkylinkParser from "../main-process/SkylinkParser";

test('skylink', (t) => {
  const fixture = JSON.parse(fs.readFileSync('test/fixtures/skylink-one.json', 'utf8'));
  const parser = new SkylinkParser(fixture);
  const result = parser.run('2019-01-01');
  t.is(result, 321504);
});
