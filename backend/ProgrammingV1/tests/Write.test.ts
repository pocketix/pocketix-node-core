import {deepStrictEqual} from 'assert';
import {referenceTable} from '../src/Program';
import {ValueType} from '../src/ValueType';
import {Write} from '../src/Write';
import {MockReferencedValue} from './MockReferencedValue';
import {Reference} from '../src/Operators';

describe('Test Write', () => {
    it('Tests write represent', () => {
        const rawBlock = {
            reference: '5451.56',
            value: '10'
        };

        const block = new Write(rawBlock);

        deepStrictEqual(block.represent(), rawBlock);
    });

    it('Tests write', () => {
        const expectedValue = 10;
        const referenceString = '11.number';

        const rawBlock = {
            reference: referenceString,
            value: expectedValue
        };

        const reference = new Reference();

        reference.initializeOperands(['variable']);

        const referencedValue = {
            _value: 20,
            _type: ValueType.Number,
            _dirty: false,
            _deviceId: 11,
            _parameterName: 'number'
        };

        referenceTable[referenceString] = Object.assign(new MockReferencedValue(), referencedValue);
        const newReference = Object.assign(new MockReferencedValue(), {
            ...referencedValue,
            _dirty: true,
            _value: expectedValue
        });

        const write = new Write(rawBlock);
        write.evaluate();

        deepStrictEqual(referenceTable[referenceString], newReference);
    });
});
