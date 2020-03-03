import log from 'electron-log';
import {LocalDateTime, LocalDate, DateTimeFormatter, TemporalQueries} from "@js-joda/core";

interface Blocks {
  otherBlocks: Record<string, any>[];
  trafficBlocks: Record<string, any>[];
}

class Parser {
  parseDateTime(dateTime: string): LocalDateTime {
    dateTime = dateTime.replace(/\s+/g, ' ');
    const FORMATTER = DateTimeFormatter.ofPattern(
      'dd.MM.yyyy H:mm:ss'
    );

    const dateTimeQuery = {
      queryFrom: (temporal): LocalDateTime => {
        const date = temporal.query(TemporalQueries.localDate());
        const time = temporal.query(TemporalQueries.localTime());
        return date.atTime(time);
      }
    };

    return FORMATTER.parse(dateTime, dateTimeQuery);
  }

  parseTrafficAmount(amount: string): number {
    return Number(amount.split('Kb')[0]) / 1000;
  }
}

export default class MtsParser {
  private parser = new Parser();

  run(pdfText: string, fromDate: string): number {
    const fromDate1 = LocalDate.parse(fromDate);
    let {trafficBlocks} = this.buildBlocks(pdfText);
    trafficBlocks = trafficBlocks.filter((b) => b.time >= fromDate1);
    log.info('trafficBlocks', trafficBlocks);
    return Math.round(trafficBlocks.reduce((acc, b) => acc + b.amount, 0));
  }

  public buildBlocks(text: string): Blocks {
    const lines = text.split("\n");
    let nextLineKind: string | null = null;
    const trafficBlocks: any[] = [];
    const otherBlocks: any[] = [];
    let block: any = {};
    let curLineKind: string | null = null;
    let skipNextLine = true;
    lines.forEach((line: string, idx: number) => {
      const skip = skipNextLine;
      if (line.startsWith('Страница')) {
        nextLineKind = null;
      }
      if (!skip) {
        curLineKind = nextLineKind;
      }
      if (curLineKind && !skip) {
        block[curLineKind] = line;
      }
      skipNextLine = false;
      if (line === 'Изм. баланса') {
        nextLineKind = 'time';
      }
      switch (curLineKind) {
      case 'time': {
        block.start = idx;
        nextLineKind = 'domain';
        break;
      }
      case 'domain': {
        if (!skip) {
          if (line.includes('VOL_') || line.includes('VOLUME_') ||
              line.includes('Traffic_Category_R') || line.includes('Vam_Zvon') ||
              line.includes('internet_turbo')) {

            skipNextLine = true;
          }
          nextLineKind = 'kind';
        }
        break;
      }
      case 'kind': {
        if (block.kind === 'ch' && line === 'ch') {
          skipNextLine = true;
        } else {
          nextLineKind = 'amount';
        }
        break;
      }
      case 'amount': {
        nextLineKind = 'price';
        break;
      }
      case 'price': {
        nextLineKind = 'time';
        break;
      }
      }
      if (nextLineKind === 'time') {
        if (curLineKind) {
          if (block.time) {
            block.raw.time = block.time;
            block.time = this.parser.parseDateTime(block.time);
          }
          if (block.amount.endsWith('Kb')) {
            block.raw.amount = block.amount;
            block.amount = this.parser.parseTrafficAmount(block.amount);
            trafficBlocks.push(block);
          } else {
            otherBlocks.push(block);
          }
        }
        block = {raw: {}}
      }
      if (line === 'Итого') {
        nextLineKind = null;
      }
    });
    log.info('traffic: ', trafficBlocks);
    log.info('other:', otherBlocks);
    return {otherBlocks, trafficBlocks};
  }
}
