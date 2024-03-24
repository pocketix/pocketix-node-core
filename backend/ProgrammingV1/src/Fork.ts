import {IEvaluable} from './IEvaluable';
import {IRepresentable} from './IRepresentable';
import {If} from './If';

class Fork implements IEvaluable, IRepresentable {
    public static NAME = 'fork';
    private readonly block: If;

    constructor(raw: any) {
        this.block = new If(raw.block);
    }

    evaluate(): any {
        return this.block.evaluate();
    }

    represent(): any {
        return {
            name: Fork.NAME,
            block: this.block ? this.block.represent() : [],
            condition: ''
        };
    }
}

export {Fork};
