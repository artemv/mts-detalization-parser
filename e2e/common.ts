import {Application} from 'spectron';
import path from 'path';

export function commonSetup(test): void {
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
