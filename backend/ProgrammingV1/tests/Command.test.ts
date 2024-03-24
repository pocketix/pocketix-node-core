import {describe} from 'mocha';
import {deepStrictEqual, strictEqual} from 'assert';
import {Command} from '../src/Command';


describe('Test command', () => {
    it('Tests command represent', () => {
        const rawCommand = {
            name: '5451.56.close',
            params: []
        };

        const command = new Command(rawCommand);

        deepStrictEqual(command.represent(), rawCommand);
    });

    it('Tests command evaluate', () => {
        const rawCommand = {
            name: '5451.56.close',
            params: []
        };

        const command = new Command(rawCommand);

        deepStrictEqual(command.evaluate(), command);
    });

    it('Tests name correctly parsed', () => {
        const rawCommand = {
            name: '5451.56.close',
            params: []
        };

        const command = new Command(rawCommand);

        strictEqual(command.deviceId, 5451);
        strictEqual(command.commandId, 56);
        strictEqual(command.commandValue, 'close');
    });
});
