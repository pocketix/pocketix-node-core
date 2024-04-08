import {IEvaluable} from './IEvaluable';
import {IRepresentable} from './IRepresentable';

class Command implements IEvaluable, IRepresentable {
    get params(): any[] {
        return this._params;
    }

    set params(value: any[]) {
        this._params = value;
    }
    get commandValue(): any {
        return this._commandValue;
    }
    get deviceId(): number {
        return this._deviceId;
    }
    get commandId(): number {
        return this._commandId;
    }
    private name: string;
    private _params: any[];
    private _commandValue: any;
    private _deviceId: number;
    private _commandId: number;

    constructor(raw: any) {
        this.name = raw.name;
        this._params = raw.params;
        const [deviceId, commandId, commandValue] = this.name.split('.');
        this._deviceId = +deviceId;
        this._commandId = +commandId;
        this._commandValue = commandValue;
    }

    public represent(): any {
        return {
            name: this.name,
            params: this.params
        };
    }

    evaluate(): any {
        return this;
    }
}

export {
    Command
};
