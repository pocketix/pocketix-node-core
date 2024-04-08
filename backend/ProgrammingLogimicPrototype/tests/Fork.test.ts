import {deepStrictEqual} from 'assert';
import {Fork} from '../src/Fork';

describe('Test fork', () => {
    it('Tests condition represent', () => {
        const rawFork = {
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
        };
        const fork = new Fork(rawFork);

        deepStrictEqual(fork.represent(), rawFork);
    });
});
