import {Variable} from "./types/Variables";
import {CompareOperators, NumericOperators} from "./types/Operators";

class Expression {
    private operand1: string | number | boolean | Expression | Variable;
    private operator: NumericOperators | CompareOperators;
    private operand2?: string | number | boolean | Expression | Variable;
    constructor(expression: any) {
        this.

    }
}

export {Expression};
