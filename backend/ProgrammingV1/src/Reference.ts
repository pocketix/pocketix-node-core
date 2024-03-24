import {ReferencedValue} from "./ReferencedValue";
import {references, referenceTable} from "./Program";
import {Variable, VariableType} from "./types/Variables";

class Reference {
    get type(): VariableType {
        return this._type;
    }

    set type(value: VariableType) {
        this._type = value;
    }
    private variableType: VariableType;
    private
    private _type: VariableType;
    get userDefined(): boolean {
        return this._userDefined;
    }
    set userDefined(value: boolean) {
        this._userDefined = value;
    }
    private _userDefined: boolean;
    get value(): any {
        const value = this.referenceFromReferenceTable.value;
        return typeof value === 'object' ? value.value : value;
    }

    set value(value: any) {
        const target = this.referenceFromReferenceTable;
        target.value = value;
        target.dirty = true;
    }
    get label(): string {
        return this._label;
    }

    private get referenceFromReferenceTable(): ReferencedValue {
        return referenceTable[this._label];
    }
    private _label: string;
    constructor(variable: Variable, userDefined: boolean = false) {
        this._label = variable.label;
        this._type = variable.type;
        this._userDefined = userDefined;
        references.push(this);
    }

    public evaluate(_: any[]): any {
        return this.value;
    }
}

export {Reference};
