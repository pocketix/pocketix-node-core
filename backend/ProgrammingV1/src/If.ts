import {IEvaluable} from './IEvaluable';
import {IRepresentable} from './IRepresentable';
import {Condition} from './Condition';
import {Block} from './Block';

class IfBranch implements IEvaluable, IRepresentable {
    private condition?: Condition;
    private block: Block;
    private readonly name: string;

    constructor(item: any) {
        this.condition = item.condition ? new Condition(item.condition) : undefined;
        this.name = item?.name;
        this.block = new Block(item.block);
    }

    public isElse(): boolean {
        return this.condition === undefined;
    }

    public isTruthy(): any {
        return this.condition === undefined || this.condition.evaluate();
    }

    private getName(): string {
        return this.name ? this.name : (this.isElse() ? 'else' : 'elseif');
    }

    public represent(): any {
        return {
            name: this.getName(),
            condition: this.condition === undefined ? '' : this.condition.represent(),
            block: this.block.represent()
        };
    }

    public evaluate(): any {
        if (!this.isTruthy()) {
            return;
        }

        return this.block.evaluate();
    }
}

class If implements IEvaluable, IRepresentable {
    private conditions: IfBranch[];

    constructor(raw: object[]) {
        this.conditions = raw.map(item => new IfBranch(item));

        if (!this.conditions.length) {
            throw Error('No If branches');
        }

        let elseCount = 0;
        this.conditions.forEach(condition => elseCount += +condition.isElse());

        if (elseCount - 1 > 1) {
            throw Error('Too many else branches');
        }
    }

    public represent(): any {
        const conditions = this.conditions.map(condition => condition.represent());

        if (conditions.length > 0) {
            conditions[0].name = 'if';
        }

        return conditions;
    }

    evaluate(): any {
        const branchToEvaluate = this.conditions.find(condition => condition.isTruthy());
        return branchToEvaluate?.evaluate();
    }
}

export {If, IfBranch};
