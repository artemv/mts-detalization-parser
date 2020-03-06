import {Parser} from "./constants";
import log from "electron-log";

export default class SkylinkParser implements Parser {
  private items: any[];

  constructor(items: any[]) {
    this.items = items;
    // log.debug('SkylinkParser items', JSON.stringify(items));
  }

  run(fromDate: string): number {
    let res = 0;
    for (const item of this.items) {
      if (item.str.startsWith('Трафик:')) {
        const r = item.str.split('Трафик:')[1];
        const am = r.split(' ')[0];
        let am1 = Number(am) / 1000000;
        log.debug('parsed tr block', Math.round(am1 * 100) / 100, item);
        res += am1;
      }
    }
    return Math.round(res);
  }

}
