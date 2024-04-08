import {IEvaluable} from './IEvaluable';
import {IRepresentable} from './IRepresentable';
import {Hours, Operator, Reference} from './Operators';
import {isPrimitive, Operand, OperandFactory} from './OperandFactory';
import {OperatorFactory} from './OperatorFactory';

class Condition implements IEvaluable, IRepresentable {
    private static REGEX = /(\w+\.\w+)/gm;
    private _operator: Operator;
    private _operands: Operand[];
    private operatorFactory: OperatorFactory = new OperatorFactory();
    private operandFactory: OperandFactory = new OperandFactory();
    private referencesForBasicCondition: Reference[] = [];
    private readonly isBasicCondition: boolean;
    private raw?: string;

    constructor(raw: any) {
        this.isBasicCondition = typeof raw === 'string';

        if (this.isBasicCondition) {
            this.raw = raw as string;
            this.handleBasicConditions();
            return;
        }

        this._operands = raw.operands.map(operand => this.operandFactory.create(operand));
        this._operator = this.operatorFactory.create(raw.operator);

        this._operator.initializeOperands(this._operands);

        if ((!this.operator && this.operands?.length) || (this.operator && !this.operands?.length)) {
            throw new Error('No operands or unrecognized operator');
        }

        if (this.operands?.length && !this.operator.isCorrectNumberOfOperands(this.operands.length)) {
            throw new Error('Incorrect number of operands');
        }
    }

    private handleBasicConditions(): void {
        let matches = Condition.REGEX.exec(this.raw);

        while (matches !== null) {
            if (matches.index === Condition.REGEX.lastIndex) {
                Condition.REGEX.lastIndex++;
            }

            matches.forEach((match) => {
                const ref = new Reference();
                ref.initializeOperands([match]);
                this.referencesForBasicCondition.push(ref);
            });

            matches = Condition.REGEX.exec(this.raw);
        }
    }

    get operands(): any[] {
        return this._operands;
    }

    set operands(value: Operand[]) {
        this._operands = value;
    }

    get operator(): Operator {
        return this._operator;
    }

    set operator(value: Operator) {
        this._operator = value;
    }

    evaluate(): any {
        if (this.isBasicCondition) {
            let raw = this.raw;
            this.referencesForBasicCondition.forEach(
                reference => raw = raw.replace(reference.referenceTarget, JSON.stringify(reference.value))
            );
            raw = raw.split('hours(now)').join((new Hours()).evaluate(['now']));
            return Function(`return ${raw}`)();
        }

        return this.operator.evaluate(this.operands.map(operand => isPrimitive(operand) ? operand : operand.evaluate()));
    }

    represent(): any {
        if (this.isBasicCondition) {
            return this.raw;
        }

        return {
            operator: this.operator.represent(),
            operands: this.operands.map(operand => isPrimitive(operand) ? operand : operand.represent())
        };
    }
}

export {Condition};
