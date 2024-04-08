import {
    Add,
    Divide,
    Equal,
    GreaterOrEqualThan,
    GreaterThan,
    LessOrEqualThan,
    LessThan,
    Multiply,
    NotEqual,
    Operators,
    Reference,
    Subtract
} from '../src/Operators';
import assert, {strictEqual} from 'assert';
import {describe} from 'mocha';
import {referenceTable} from '../src/Program';
import {MockReferencedValue} from './MockReferencedValue';
import {ValueType} from '../src/ValueType';

describe('Test operators', () => {
    describe('Test the LessThan operator (<)', () => {
        it('Tests represent', () => {
            const lessThan = new LessThan();

            strictEqual(lessThan.represent(), Operators.LessThan);
        });

        it('Test first being < second', () => {
            const lessThan = new LessThan();

            strictEqual(lessThan.evaluate([1, 2]), true);
        });

        it('Test first being > second', () => {
            const lessThan = new LessThan();

            strictEqual(lessThan.evaluate([2, 1]), false);
        });

        it('Test first being = second', () => {
            const lessThan = new LessThan();

            strictEqual(lessThan.evaluate([2, 2]), false);
        });
    });

    describe('Test the GreaterThan operator (>)', () => {
        it('Tests represent', () => {
            const greaterThan = new GreaterThan();

            strictEqual(greaterThan.represent(), Operators.GreaterThan);
        });

        it('Test first being < second', () => {
            const greaterThan = new GreaterThan();

            strictEqual(greaterThan.evaluate([1, 2]), false);
        });

        it('Test first being > second', () => {
            const greaterThan = new GreaterThan();

            strictEqual(greaterThan.evaluate([2, 1]), true);
        });

        it('Test first being = second', () => {
            const greaterThan = new GreaterThan();

            strictEqual(greaterThan.evaluate([2, 2]), false);
        });
    });

    describe('Test the LessOrEqualThan operator (<=)', () => {
        it('Tests represent', () => {
            const lessOrEqualThan = new LessOrEqualThan();

            strictEqual(lessOrEqualThan.represent(), Operators.LessOrEqualThan);
        });

        it('Test first being < second', () => {
            const lessOrEqualThan = new LessOrEqualThan();

            strictEqual(lessOrEqualThan.evaluate([1, 2]), true);
        });

        it('Test first being > second', () => {
            const lessOrEqualThan = new LessOrEqualThan();

            strictEqual(lessOrEqualThan.evaluate([2, 1]), false);
        });

        it('Test first being = second', () => {
            const lessOrEqualThan = new LessOrEqualThan();

            strictEqual(lessOrEqualThan.evaluate([2, 2]), true);
        });
    });

    describe('Test the GreaterOrEqualThan operator (>=)', () => {
        it('Tests represent', () => {
            const greaterOrEqualThan = new GreaterOrEqualThan();

            strictEqual(greaterOrEqualThan.represent(), Operators.GreaterOrEqualThan);
        });

        it('Test first being < second', () => {
            const greaterOrEqualThan = new GreaterOrEqualThan();

            strictEqual(greaterOrEqualThan.evaluate([1, 2]), false);
        });

        it('Test first being > second', () => {
            const greaterOrEqualThan = new GreaterOrEqualThan();

            strictEqual(greaterOrEqualThan.evaluate([2, 1]), true);
        });

        it('Test first being = second', () => {
            const greaterOrEqualThan = new GreaterOrEqualThan();

            strictEqual(greaterOrEqualThan.evaluate([2, 2]), true);
        });
    });

    describe('Test the Equal operator (==)', () => {
        it('Tests represent', () => {
            const equal = new Equal();

            strictEqual(equal.represent(), Operators.Equal);
        });

        it('Test first being < second', () => {
            const equal = new Equal();

            strictEqual(equal.evaluate([1, 2]), false);
        });

        it('Test first being > second', () => {
            const equal = new Equal();

            strictEqual(equal.evaluate([2, 1]), false);
        });

        it('Test first being = second', () => {
            const equal = new Equal();

            strictEqual(equal.evaluate([2, 2]), true);
        });
    });

    describe('Test the NotEqual operator (!=)', () => {
        it('Tests represent', () => {
            const notEqual = new NotEqual();

            strictEqual(notEqual.represent(), Operators.NotEqual);
        });

        it('Test first being < second', () => {
            const notEqual = new NotEqual();

            strictEqual(notEqual.evaluate([1, 2]), true);
        });

        it('Test first being > second', () => {
            const notEqual = new NotEqual();

            strictEqual(notEqual.evaluate([2, 1]), true);
        });

        it('Test first being = second', () => {
            const notEqual = new NotEqual();

            strictEqual(notEqual.evaluate([2, 2]), false);
        });
    });

    describe('Test the Add operator (+)', () => {
        it('Tests represent', () => {
            const add = new Add();

            strictEqual(add.represent(), Operators.Add);
        });

        it('Test both positive', () => {
            const add = new Add();

            strictEqual(add.evaluate([2, 2]), 4);
        });

        it('Test one positive one negative', () => {
            const add = new Add();

            strictEqual(add.evaluate([2, -2]), 0);
        });
    });

    describe('Test the Subtract operator (-)', () => {
        it('Tests represent', () => {
            const subtract = new Subtract();

            strictEqual(subtract.represent(), Operators.Subtract);
        });

        it('Test both positive', () => {
            const subtract = new Subtract();

            strictEqual(subtract.evaluate([2, 2]), 0);
        });

        it('Test one positive one negative', () => {
            const subtract = new Subtract();

            strictEqual(subtract.evaluate([2, -2]), 4);
        });
    });

    describe('Test the Multiply operator (*)', () => {
        it('Tests represent', () => {
            const multiply = new Multiply();

            strictEqual(multiply.represent(), Operators.Multiply);
        });

        it('Test both positive', () => {
            const multiply = new Multiply();

            strictEqual(multiply.evaluate([2, 2]), 4);
        });

        it('Test one positive one negative', () => {
            const multiply = new Multiply();

            strictEqual(multiply.evaluate([2, -2]), -4);
        });
    });

    describe('Test the Divide operator (/)', () => {
        it('Tests represent', () => {
            const divide = new Divide();

            strictEqual(divide.represent(), Operators.Divide);
        });

        it('Test both positive', () => {
            const divide = new Divide();

            strictEqual(divide.evaluate([2, 2]), 1);
        });

        it('Test one positive one negative', () => {
            const divide = new Divide();

            assert.throws(() => divide.evaluate([2, 0]), Error);
        });
    });

    describe('Test the Reference operator (parameter)', () => {
        it('Tests represent', () => {
            const reference = new Reference();

            strictEqual(reference.represent(), Operators.Parameter);
        });

        it('Test string value returned', () => {
            const reference = new Reference();

            reference.initializeOperands(['variable']);

            const referencedValue = {
                _value: 'value',
                _type: ValueType.String,
                _dirty: false,
                _deviceId: 10,
                _parameterName: 'string'
            };

            referenceTable.variable = Object.assign(new MockReferencedValue(), referencedValue);

            strictEqual(reference.evaluate([]), referencedValue._value);
        });

        it('Test number value returned', () => {
            const reference = new Reference();

            reference.initializeOperands(['variable']);

            const referencedValue = {
                _value: 10,
                _type: ValueType.Number,
                _dirty: false,
                _deviceId: 10,
                _parameterName: 'string'
            };

            referenceTable.variable = Object.assign(new MockReferencedValue(), referencedValue);

            strictEqual(reference.evaluate([]), referencedValue._value);
        });

        it('Test object value returned', () => {
            const reference = new Reference();

            reference.initializeOperands(['variable']);

            const referencedValue = {
                _value: {value: 'value'},
                _type: ValueType.Object,
                _dirty: false,
                _deviceId: 10,
                _parameterName: 'string'
            };

            referenceTable.variable = Object.assign(new MockReferencedValue(), referencedValue);

            strictEqual(reference.evaluate([]), referencedValue._value.value);
        });
    });
});
