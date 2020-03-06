import log from 'electron-log';

import MtsParser from "./MtsParser";
import {Parser} from "./constants";
import pdf from 'pdf-parse';
import SkylinkParser from "./SkylinkParser";

export default class ParsersFactory {

  static async createByPdfData(dataBuffer: Buffer): Promise<any> {
    const items = [];
    let klass;
    await pdf(dataBuffer, {
      pagerender: (pageData) => {
        return pageData.getTextContent({
          disableCombineTextItems: true
        })
          .then((textContent) => {
            log.debug('new page');
            items.push(...textContent.items);
            for (const item of textContent.items) {
              // log.info('pdf parsing item', item);
              if (item.str.includes('Skylink')) {
                klass = SkylinkParser;
                return textContent.items;
              } else if (item.str.includes('internet.mts.ru')) {
                klass = MtsParser;
                return textContent.items;
              }
            }
          });
      }
    });
    return new klass(items);
  }
}
