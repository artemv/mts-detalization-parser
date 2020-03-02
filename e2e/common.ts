const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const { Application } = require('spectron');
const path = require('path');
const { execSync } = require('child_process');

export function commonSetup(test) {
    test.beforeEach(async (t) => {
        t.context.app = new Application({
            path: path.resolve(path.join(__dirname, '..',
                'dist/mac/MtsDetalizationParser.app/Contents/MacOS/MtsDetalizationParser'))
        });

        await t.context.app.start();
        t.context.browser = t.context.app.client;
    });

    test.afterEach.always(async (t) => {
        await t.context.app.stop();
    });
}
