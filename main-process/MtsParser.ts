import log from 'electron-log';
import {LocalDateTime, LocalDate, DateTimeFormatter, TemporalQueries} from "@js-joda/core";
const fs = require('fs');
const pdf = require('pdf-parse');

class Parser {
    parseDateTime(dateTime: string): LocalDateTime {
        dateTime = dateTime.replace(/\s+/g, ' ');
        const FORMATTER = DateTimeFormatter.ofPattern(
            'dd.MM.yyyy H:mm:ss'
        );

        let dateTimeQuery = {
            queryFrom: function(temporal) {
                var date = temporal.query(TemporalQueries.localDate());
                var time = temporal.query(TemporalQueries.localTime());
                return date.atTime(time);
            }
        };

        return FORMATTER.parse(dateTime, dateTimeQuery);
    }

    parseTrafficAmount(amount: string) {
        return Number(amount.split('Kb')[0]) / 1000;
    }
}

interface ReportBlock{
    time: any;
    amount: any;
}

export default class MtsParser {
    private filePath: string;
    private fromDate: LocalDate;
    private parser = new Parser();

    constructor(filePath: string, fromDate: string) {
        this.filePath = filePath;
        this.fromDate = LocalDate.parse(fromDate);
    }

    async run() {
        let {trafficBlocks} = await this.parseFile();
        trafficBlocks = trafficBlocks.filter((b) => b.time >= this.fromDate);
        log.info('trafficBlocks', trafficBlocks);
        return trafficBlocks.reduce((acc, b) => acc + b.amount, 0);
    }

    private async parseFile():Promise<{otherBlocks: ReportBlock[], trafficBlocks: ReportBlock[]}> {
        let dataBuffer = fs.readFileSync(this.filePath);
        let rawData = await pdf(dataBuffer);

        return this.buildBlocks(rawData);
    }

    private buildBlocks(rawData) {
        let lines = rawData.text.split("\n");
        let nextLineKind: string | null = null;
        let trafficBlocks: any[] = [];
        let otherBlocks: any[] = [];
        let block: any = {};
        let curLineKind: string | null = null;
        let skipNextLine: boolean = true;
        lines.forEach((line: string, idx: number) => {
            let skip = skipNextLine;
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
                    nextLineKind = 'amount';
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
