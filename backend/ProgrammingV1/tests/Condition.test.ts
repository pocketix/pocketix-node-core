import {describe} from 'mocha';
import {deepStrictEqual, strictEqual} from 'assert';
import {Condition} from '../src/Condition';
import {referenceTable} from '../src/Program';
import {ValueType} from '../src/ValueType';
import {MockReferencedValue} from './MockReferencedValue';

describe('Test conditions', () => {
    describe('Test basic condition', () => {
        beforeEach('Fill reference values', () => {
            const stringOpen = {
                _value: 'open',
                _type: ValueType.String,
                _dirty: false,
                _deviceId: 1,
                _parameterName: 'stringOpen'
            };

            const number1 = {
                _value: 1,
                _type: ValueType.Number,
                _dirty: false,
                _deviceId: 1,
                _parameterName: 'number1'
            };

            const stringFalse = {
                _value: 'false',
                _type: ValueType.String,
                _dirty: false,
                _deviceId: 1,
                _parameterName: 'stringFalse'
            };

            const number0 = {
                _value: 0,
                _type: ValueType.Number,
                _dirty: false,
                _deviceId: 1,
                _parameterName: 'number0'
            };

            referenceTable['1.stringOpen'] = Object.assign(new MockReferencedValue(), stringOpen);

            referenceTable['1.number1'] = Object.assign(new MockReferencedValue(), number1);

            referenceTable['1.stringFalse'] = Object.assign(new MockReferencedValue(), stringFalse);

            referenceTable['1.number0'] = Object.assign(new MockReferencedValue(), number0);
        });


        it('Tests basic condition represent', () => {
            const condition = '1.stringOpen === \'open\'';
            const basicCondition = new Condition(condition);

            strictEqual(basicCondition.represent(), condition);
        });

        it('Tests true string', () => {
            const condition = '\'open\' === \'open\'';
            const basicCondition = new Condition(condition);

            strictEqual(basicCondition.evaluate(), true);
        });

        it('Tests true number', () => {
            const condition = '1 === 1';
            const basicCondition = new Condition(condition);

            strictEqual(basicCondition.evaluate(), true);
        });

        it('Tests false string', () => {
            const condition = '\'false\' === \'open\'';
            const basicCondition = new Condition(condition);

            strictEqual(basicCondition.evaluate(), false);
        });

        it('Tests false number', () => {
            const condition = '0 === 1';
            const basicCondition = new Condition(condition);

            strictEqual(basicCondition.evaluate(), false);
        });

        it('Tests true string reference', () => {
            const condition = '1.stringOpen === \'open\'';

            const basicCondition = new Condition(condition);

            strictEqual(basicCondition.evaluate(), true);
        });

        it('Tests true number', () => {
            const condition = '1.number1 === 1';

            const basicCondition = new Condition(condition);

            strictEqual(basicCondition.evaluate(), true);
        });

        it('Tests false string', () => {
            const condition = '1.stringFalse === \'open\'';

            const basicCondition = new Condition(condition);

            strictEqual(basicCondition.evaluate(), false);
        });

        it('Tests false number', () => {
            const condition = '1.number0 === 1';
            const basicCondition = new Condition(condition);

            strictEqual(basicCondition.evaluate(), false);
        });
    });

    describe('Test condition', () => {
        it('Tests condition represent', () => {
            const condition = {
                operator: '==',
                operands: [
                    {
                        operator: 'parameter',
                        operands: ['1.stringOpen']
                    },
                    {
                        operator: 'value',
                        operands: ['close']
                    }
                ]
            };
            const basicCondition = new Condition(condition);

            deepStrictEqual(basicCondition.represent(), condition);
        });
    });
});
