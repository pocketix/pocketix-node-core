import {describe} from 'mocha';
import {CommandFactory} from '../src/CommandFactory';
import {strictEqual} from 'assert';
import {If, IfBranch} from '../src/If';
import {Fork} from '../src/Fork';
import {Command} from '../src/Command';
import {Write} from '../src/Write';

describe('Test commandFactory', () => {
    describe('Test correct commandable being created', () => {
        it('Test if branch being created', () => {
            const commandFactory = new CommandFactory();

            const result = commandFactory.create({
                name: 'if',
                block: [
                    {
                        name: '5451.56.close',
                        params: []
                    }
                ],
                condition: '5451.Relay1 === \'open\''
            });

            strictEqual(result instanceof IfBranch, true);
        });

        it('Test if being created with name', () => {
            const commandFactory = new CommandFactory();

            const result = commandFactory.create([
                {
                    name: 'if',
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '5451.Relay1 === \'open\''
                }
            ]);

            strictEqual(result instanceof If, true);
        });

        it('Test if being created without name', () => {
            const commandFactory = new CommandFactory();

            const result = commandFactory.create([
                {
                    block: [
                        {
                            name: '5451.56.close',
                            params: []
                        }
                    ],
                    condition: '5451.Relay1 === \'open\''
                }
            ]);

            strictEqual(result instanceof If, true);
        });

        it('Test Fork being created', () => {
            const commandFactory = new CommandFactory();

            const result = commandFactory.create({
                name: 'fork',
                block: [
                    {
                        name: 'if',
                        block: [
                            {
                                name: '5451.56.close',
                                params: []
                            }
                        ],
                        condition: '5451.Relay1 === \'open\''
                    }
                ],
                condition: ''
            });

            strictEqual(result instanceof Fork, true);
        });

        it('Test command created', () => {
            const commandFactory = new CommandFactory();

            const result = commandFactory.create({
                name: '5451.56.close',
                params: []
            });

            strictEqual(result instanceof Command, true);
        });

        it('Test reference created', () => {
            const commandFactory = new CommandFactory();

            const result = commandFactory.create({
                reference: '5451.56',
                value: '10'
            });

            strictEqual(result instanceof Write, true);
        });
    });
});
