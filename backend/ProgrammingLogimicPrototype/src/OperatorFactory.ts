import {
    Add,
    And,
    Day,
    Divide,
    Equal,
    GreaterOrEqualThan,
    GreaterThan,
    Hours,
    LessOrEqualThan,
    LessThan,
    Minutes,
    Month,
    Multiply,
    NotEqual,
    Operator,
    Operators, Or,
    Reference,
    Subtract,
    Value,
    Year
} from "./Operators";

class OperatorFactory {
    public create(raw: string | undefined): Operator | undefined {
        if (raw === undefined) {
            return undefined;
        }

        switch (raw) {
            case Operators.LessThan:
                return new LessThan();
            case Operators.LessOrEqualThan:
                return new LessOrEqualThan();
            case Operators.GreaterThan:
                return new GreaterThan();
            case Operators.GreaterOrEqualThan:
                return new GreaterOrEqualThan();
            case Operators.Equal:
                return new Equal();
            case Operators.NotEqual:
                return new NotEqual();
            case Operators.Add:
                return new Add();
            case Operators.Subtract:
                return new Subtract();
            case Operators.Multiply:
                return new Multiply();
            case Operators.Divide:
                return new Divide();
            case Operators.Value:
                return new Value();
            case Operators.Parameter:
                return new Reference();
            case Operators.Minutes:
                return new Minutes();
            case Operators.Hours:
                return new Hours();
            case Operators.Day:
                return new Day();
            case Operators.Month:
                return new Month();
            case Operators.Year:
                return new Year();
            case Operators.And:
                return new And();
            case Operators.Or:
                return new Or();
            default:
                throw new Error('Unrecognized operator');
        }
    }
}

export {OperatorFactory};
