import {deepStrictEqual, throws} from 'assert';
import {Block} from '../src/Block';

describe('Test block', () => {
    it('Tests condition represent', () => {
        const rawBlock = [
            {
                name: '5451.56.close',
                params: []
            }
        ];
        const block = new Block(rawBlock);

        deepStrictEqual(block.represent(), rawBlock);
    });

    it('Should fail on empty block', () => {
        const rawBlock = [];

        throws(() => new Block(rawBlock), Error);
    });
});
