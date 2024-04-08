import {IEvaluable} from './IEvaluable';
import {IRepresentable} from './IRepresentable';
import {Block} from './Block';
import {ReferencedValue} from './ReferencedValue';
import {Reference} from './Operators';
import {Command} from './Command';

const references: Reference[] = [];
const referenceTable: { [key: string]: ReferencedValue } = {};

class Program implements IEvaluable, IRepresentable {
    private block: Block;
    private readonly references: Reference[];

    constructor(program: object) {
        // @ts-ignore
        this.block = new Block(program.block);
        this.references = [...references];
    }

    public getReferencesToLoad(): Reference[] {
        console.log("references to load", JSON.stringify(this.references, null, 1));
        return this.references.filter(
            (value, index, theRestOfReferences) =>
                theRestOfReferences.findIndex(
                    v2 => (v2.referenceTarget === value.referenceTarget)
                ) === index);
    }

    public setReferencesTargets(targets: ReferencedValue[]): void {
        this.references.forEach(reference => {
            referenceTable[reference.referenceTarget] = targets.find(target => target.referenceTarget === reference.referenceTarget);
        });
    }

    public getReferencesToUpdate(): ReferencedValue[] {
        return Object.values(referenceTable).filter(reference => reference.dirty);
    }

    evaluate(): Command[] {
        return this.block.evaluate().flat(Infinity);
    }

    represent(): any {
        return this.block.represent();
    }
}

export {Program, references, referenceTable};
