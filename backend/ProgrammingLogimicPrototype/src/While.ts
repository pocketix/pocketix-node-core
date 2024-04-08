import {IEvaluable} from "./IEvaluable";
import {IRepresentable} from "./IRepresentable";
import {Block} from "./Block";
import {Condition} from "./Condition";

class While implements IEvaluable, IRepresentable {
    private condition: Condition;
    private block: Block;

    constructor(raw: any) {
        this.condition = new Condition(raw.condition);
        this.block = new Block(raw.block);
    }

    public represent(): any {
        return {
            condition: this.condition.represent(),
            block: this.block.represent()
        }
    }

    evaluate(): any {
        if (this.condition.evaluate()) {
            this.block.evaluate();
        }
    }
}

export {While};
