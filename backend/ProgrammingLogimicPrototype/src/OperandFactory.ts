import {Condition} from "./Condition";
import {Reference} from "./Operators";
type Primitive = string | number | boolean;
type Operand = Condition | Reference | Primitive;

const isPrimitive = (value) => typeof value !== 'object' && typeof value !== 'function';

class OperandFactory {
    public create(raw: any): Operand {
        if (isPrimitive(raw)) {
            return raw as Primitive;
        }

        if (raw.hasOwnProperty('operands') && raw.hasOwnProperty('operator')) {
            return new Condition(raw);
        }

        throw new Error('Unknown Operand');
    }
}

export {isPrimitive, OperandFactory, Operand};
