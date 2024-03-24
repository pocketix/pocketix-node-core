import {IEvaluable} from './types/IEvaluable';
import {IRepresentable} from './types/IRepresentable';

class Command implements IEvaluable, IRepresentable {
    get args(): any[] {
        return this._args;
    }

    set args(value: any[]) {
        this._args = value;
    }
    get deviceId(): number {
        return this._deviceId;
    }
    get commandId(): number {
        return this._commandId;
    }
    private name: string;
    private _args: any[];
    private _deviceId: number;
    private _commandId: number;

    constructor(raw: any) {
        this.name = raw.name;
        this._args = raw.args;
        const [deviceId, commandId] = this.name.split('.');
        this._deviceId = +deviceId;
        this._commandId = +commandId;
    }

    public represent(): any {
        return {
            name: this.name,
            args: this.args
        };
    }

    evaluate(): any {
        return this;
    }
}

export {
    Command
};
