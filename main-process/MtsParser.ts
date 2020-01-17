import log from 'electron-log';
const fs = require('fs');
const pdf = require('pdf-parse');

export default class MtsParser {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    async run() {
        let dataBuffer = fs.readFileSync(this.filePath);

        return pdf(dataBuffer).then(function(data) {

            let lines = data.text.split("\n");
            let nextLineKind: string|null = null;
            let trafficBlocks: any[] = [];
            let otherBlocks: any[] = [];
            let block: any = {};
            let curLineKind: string|null = null;
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
                        if (block.amount.endsWith('Kb')) {
                            trafficBlocks.push(block);
                        } else {
                            otherBlocks.push(block);
                        }
                    }
                    block = {}
                }
                if (line === 'Итого') {
                    nextLineKind = null;
                }
            });
            log.info('traffic: ', trafficBlocks);
            log.info('other:', otherBlocks);
            let amounts = trafficBlocks.map((b) => Number(b.amount.split('Kb')[0] / 1000));
            return amounts.reduce((a, b) => a + b, 0);
        });


    }
}
