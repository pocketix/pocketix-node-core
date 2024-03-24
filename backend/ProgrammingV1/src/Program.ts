import {IEvaluable} from './types/IEvaluable';
import {IRepresentable} from './types/IRepresentable';
import {Block} from './Block';
import {ReferencedValue} from './ReferencedValue';
import {Reference} from './Operators';
import {Command} from './Command';
import {Header} from "./types/Header";

const references: Reference[] = [];
const referenceTable: { [key: string]: ReferencedValue } = {};

class Program implements IEvaluable, IRepresentable {
    private block: Block;
    private header: Header;
    private readonly references: Reference[];

    constructor(program: any) {
        this.block = new Block(program?.block);
        this.header = program?.header as Header;
        this.references = [...references];
    }

    public getReferencesToLoad(): Reference[] {
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
        return Object.values(referenceTable).filter(reference => reference.dirty && !reference.userDefined);
    }

    evaluate(): Command[] {
        return this.block.evaluate().flat(Infinity);
    }

    represent(): any {
        return this.block.represent();
    }
}

export {Program, references, referenceTable};
