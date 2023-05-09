import nock = require('nock');
import {start} from '../../src/index'
describe('index.ts', () => {
    it('Should create PR with changes', async () => {
        // TODO implement tests for all possible cases. Do not have a time for it now.
        nock.recorder.rec();
        await start();
    });
});
